import json
from django.conf import settings
from django.contrib.auth.models import User
from django.utils import timezone
from server.favoureat.serializers import (
    UserSerializer,
    SwipeSerializer,
    RestaurantSerializer,
    TournamentSerializer,
    EventDetailSerializer,
    EventSerializer,
    PreferenceSerializer
)
from server.models import (
    Swipe,
    Restaurant,
    Event,
    EventDetail,
    EventUserAttach,
    Preference,
    PreferenceCuisine,
    Tournament,
    Cuisine
)
from server.favoureat.recommendation_service import RecommendationService
import string
import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_social_oauth2.views import ConvertTokenView

class UserView(APIView):
    """
    Gets a single User instance.
    """
    def get_object(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response('User not found', status=status.HTTP_404_NOT_FOUND)

    def get(self, request, user_id, format=None):
        if int(user_id) != int(request.user.id):
            return Response('Bad request', status=status.HTTP_400_BAD_REQUEST)
        user = self.get_object(user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UserSwipeView(APIView):
    """
    POST: add a swipe decision for user
    """
    def post(self, request, user, format=None):
        if User.objects.filter(id=user).count() == 0:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
        request.data['user'] = user
        swipe = Swipe.objects.filter(yelp_id=request.data['yelp_id'], user=request.data['user']).first()
        if swipe is not None:
            if 'right_swipe_count' in request.data.keys():
                request.data['right_swipe_count'] += swipe.right_swipe_count
            if 'left_swipe_count' in request.data.keys():
                request.data['left_swipe_count'] += swipe.left_swipe_count
            serializer = SwipeSerializer(swipe, data=request.data)
        else:
            serializer = SwipeSerializer(None, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TokenView(ConvertTokenView):
    """
    Creates a new FavourEAT app user. By sending a request with:
    Authorization: Bearer facebook <<fb_token>>, a new app user
    will be created by the social auth library.

    Params: access_token

    Adapted from:
    https://github.com/PhilipGarnero/django-rest-framework-social-oauth2/issues/58
    https://github.com/PhilipGarnero/django-rest-framework-social-oauth2/blob/master/rest_framework_social_oauth2/views.py
    """
    def post(self, request, format=None):
        global var_status
        if request.user.id is None:
            return Response('User not created', status=status.HTTP_400_BAD_REQUEST)
        request._request.POST = request._request.POST.copy()

        request._request.POST['grant_type'] = 'convert_token'
        request._request.POST['client_id'] = settings.SOCIAL_AUTH_CLIENT_ID
        request._request.POST['client_secret'] = settings.SOCIAL_AUTH_CLIENT_SECRET
        request._request.POST['backend'] = 'facebook'
        request._request.POST['token'] = request.data.get('access_token')

        url, headers, body, var_status = self.create_token_response(request._request)
        data = json.loads(body)
        data['user_id'] = request.user.id
        response = Response(data, status=var_status)

        for k, v in headers.items():
            response[k] = v
        return response


class EventView(APIView):
    """
    A view to handle event operations.
    """
    TERM = 'restaurants'
    YELP_LIMIT = 50
    DEFAULT_RADIUS = 100
    PRICE_THRESHOLDS = [
        {'price': 20, 'yelp_cd': '1'},
        {'price': 40, 'yelp_cd': '2'},
        {'price': 60, 'yelp_cd': '3'},
        {'price': float('inf'), 'yelp_cd': '4'}
    ]

    def get(self, request, user_id, format=None):
        """
        Gets all of the events associated with the user
        """
        if int(user_id) != int(request.user.id):
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
        user_event_ids = EventUserAttach.objects.filter(
            user_id=request.user.id).values_list('event_id', flat=True)
        events = Event.objects.filter(pk__in=user_event_ids).order_by('-event_detail__datetime')
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    def get_prefs_params_data(self, **request_data):
        """
        Get the required fields for the Preference model
        Get the required fields for the query parameters
        """
        prefs = {
            'radius': request_data.get('radius', self.DEFAULT_RADIUS),
            'latitude': request_data.get('latitude', None),
            'longitude': request_data.get('longitude', None),
            'min_price': request_data.get('min_price', 0),
            'max_price': request_data.get('max_price', None),
        }

        params = {
            'term': self.TERM,
            'limit': self.YELP_LIMIT,
            'radius': prefs['radius'],
            'latitude': prefs['latitude'],
            'longitude': prefs['longitude'],
            'categories': ','.join(request_data.get('cuisine_types', ''))
        }

        for threshold in self.PRICE_THRESHOLDS:
            if prefs['max_price'] <= threshold['price']:
                params['price'] = threshold['yelp_cd']
                break

        return prefs, params

    def post(self, request, user_id, format=None):
        """
        Creates the specified event for a particular user.
        """
        try:
            user = User.objects.get(pk=user_id)
            if user.id != request.user.id:
                return Response('Invalid user id', status=status.HTTP_401_UNAUTHORIZED)

            prefs_data, params = self.get_prefs_params_data(**request.data)

            serializer = PreferenceSerializer(data=prefs_data)
            if not serializer.is_valid():
                return Response('Bad request', status=status.HTTP_400_BAD_REQUEST)

            # Get restaurants
            restaurants = RecommendationService().get_restaurants(
                user_id=user_id, preference=params)

            # Start saving
            preference = serializer.save()

            cuisines = Cuisine.objects.filter(category__in=request.data.get('cuisine_types', []))
            for cuisine in cuisines:
                preference_cuisine = PreferenceCuisine(
                    preference=preference, cuisine=cuisine)
                preference_cuisine.save()

            # Generate unique 8-digit invite code
            code_taken = True
            invite_code = ''
            while code_taken:
                invite_code = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
                if EventDetail.objects.filter(invite_code=invite_code).count() == 0:
                    code_taken = False

            event_detail = EventDetail(
                datetime=timezone.now(),
                name=request.data.get('name', timezone.now()),
                preference=preference,
                invite_code=invite_code
            )
            event_detail.save()

            user = User.objects.get(pk=user_id)
            event = Event(creator=user, event_detail=event_detail, round_num=0)
            event.save()
            event_user_attach = EventUserAttach(user=user, event=event)
            event_user_attach.save()

            # Create the tournament rounds for the event
            for restaurant in restaurants:
                tournament = Tournament(event=event, restaurant=restaurant, vote_count=0)
                tournament.save()

            response = Response({'event_id': event.id, 'invite_code': invite_code}, status=status.HTTP_201_CREATED)
            response['Location'] = '/v1/events/{id}'.format(id=event.id)
            return response

        except User.DoesNotExist:
            return Response('User not found', status=status.HTTP_404_NOT_FOUND)


class JoinEventView(APIView):
    def get_object(self, invite_code):
        try:
            event_detail = EventDetail.objects.get(invite_code=invite_code)
            event = Event.objects.get(event_detail=event_detail)
            return event, event_detail
        except EventDetail.DoesNotExist:
            return Response("Event detail with this invite code does not exist", status=status.HTTP_404_NOT_FOUND)
        except Event.DoesNotExist:
            return Response("Event does not exist", status=status.HTTP_404_NOT_FOUND)

    def get_user(self, user_id):
        try:
            user = User.objects.get(id=user_id)
            return user
        except User.DoesNotExist:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)

    def post(self, request, user_id, invite_code, format=None):
        """Join an event given an invite code"""
        user = self.get_user(user_id)
        event, event_detail = self.get_object(invite_code)
        # Check if user has already joined event
        event_user_attach = EventUserAttach.objects.filter(event=event, user=user)
        if event_user_attach.count() == 0:
            event_user_attach = EventUserAttach(user=user, event=event)
            event_user_attach.save()

        serializer = EventSerializer(event)
        resp = serializer.data
        return Response(data=resp, status=status.HTTP_201_CREATED)


class EventDetailsView(APIView):
    def get_object(self, event_id):
        try:
            event = Event.objects.get(pk=event_id)
            event_detail = EventDetail.objects.get(pk=event.event_detail_id)
            return event, event_detail
        except Event.DoesNotExist:
            return Response("Event does not exist", status=status.HTTP_404_NOT_FOUND)
        except EventDetail.DoesNotExist:
            return Response("Event detail does not exist", status=status.HTTP_404_NOT_FOUND)

    def get(self, request, user_id, event_id, format=None):
        """Get an event's event detail."""
        if User.objects.filter(id=user_id).count() == 0:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
        event, event_detail = self.get_object(event_id)
        serializer = EventDetailSerializer(event_detail)
        return Response(serializer.data)

    def put(self, request, user_id, event_id, format=None):
        """Updates event detail. Note that only the user who created the event can update the details."""
        if User.objects.filter(id=user_id).count() == 0:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
        event, event_detail = self.get_object(event_id)
        if int(event.creator_id) != int(user_id):
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)

        serializer = EventDetailSerializer(event_detail, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id, event_id, format=None):
        if User.objects.filter(id=user_id).count() == 0:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
        event, event_detail = self.get_object(event_id)
        if event.creator != long(user_id):
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
        event.delete()
        event_detail.delete()
        return Response(status=status.HTTP_200_OK)


class IndividualTournamentView(APIView):
    """
    A class to handle the retrieval and updating of tournament information.

    HTTP methods: GET, PUT
    """
    def get_object(self, event_id):
        try:
            event = Event.objects.get(pk=event_id)
            return event
        except Event.DoesNotExist:
            return Response("Event does not exist", status=status.HTTP_404_NOT_FOUND)

    def update_next_round(self, event_id, tournament_data):
        num_participants = EventUserAttach.objects.filter(event=event_id).count()
        round_completed = True
        event = Event.objects.get(pk=event_id)
        if event.is_group and ((timezone.now() - event.round_start).total_seconds() / 3600) >= event.round_duration:
            if event.round_num == 0:
                return False
            for t in tournament_data:
                if t[0].vote_count + t[1].vote_count != num_participants:
                    round_completed = False

        if not round_completed:
            return False

        event.round_num += 1
        event.round_start = timezone.now()
        event.save()
        # Update restaurants for next tournament round
        if event.round_num == 1:
            for t in tournament_data:
                tournament = Tournament.objects.get(pk=t['id'])
                if tournament.vote_count > 0:
                    tournament.vote_count = 0
                    tournament.save()
                else:
                    tournament.delete()
        else:
            for t in tournament_data:
                tournament1 = Tournament.objects.get(pk=t[0]['id'])
                tournament2 = Tournament.objects.get(pk=t[1]['id'])
                if tournament1.vote_count == tournament2.vote_count:
                    tournament1.vote_count = 0
                    tournament1.save()
                    tournament2.vote_count = 0
                    tournament2.save()
                elif tournament1.vote_count > tournament2.vote_count:
                    tournament1.vote_count = 0
                    tournament1.save()
                    tournament2.delete()
                else:
                    tournament2 = Tournament.objects.get(pk=t[1]['id'])
                    tournament2.save()
                    tournament1.delete()

        return True

    def get(self, request, event_id, format=None):
        """
        Gets the tournament restaurants that will participate in a tournament
        round. In round 0, only a list of restaurants participate. In later
        rounds, restaurants are paired up.
        """
        event = self.get_object(event_id)
        tournaments = Tournament.objects.filter(event_id=event_id)
        data = TournamentSerializer(tournaments, many=True).data

        # If round 0, then return list of restaurants (no pairings)
        if event.round_num == 0:
            return Response(data)

        # Tournament restaurants swiping stage
        paired_tournaments_data = [list(x) for x in zip(
            data[:len(data)/2], data[len(data)/2:])]
        # If there are odd number of restaurants, then carry the extra one to next round.
        if len(data) % 2 != 0:
            num_votes = EventUserAttach.objects.filter(event=event_id).count()
            tournament = Tournament.objects.get(pk=data[len(data) - 1]['id'])
            tournament.vote_count = num_votes
            tournament.save()
            if len(paired_tournaments_data) == 0:
                return Response(data)

        return Response(paired_tournaments_data)

    def put(self, request, event_id, tournament_id, format=None):
        """
        Increments the vote count of a tournament restaurant.
        """
        try:
            tournament = Tournament.objects.get(pk=tournament_id)
            tournament.vote_count += 1
            tournament.save()
            # Check if tournament round is over. If so, handle it.
            if 'is_finished' in request.data.keys() and request.data['is_finished']:
                is_round_over = self.update_next_round(event_id, request.data['tournament_data'])
                if is_round_over:
                    return Response("Next", status=status.HTTP_200_OK)
            return Response(status=status.HTTP_200_OK)
        except Tournament.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
