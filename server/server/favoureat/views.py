import json
from django.conf import settings
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Avg
from server.favoureat.serializers import (
    UserSerializer,
    SwipeSerializer,
    RestaurantSerializer,
    TournamentSerializer,
    EventDetailSerializer,
    EventSerializer,
    EventUserAttachSerializer,
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
    Cuisine,
    UserFcm
)
from server.favoureat.recommendation_service import RecommendationService
from server.favoureat.fcm_service import FcmService
from server.favoureat.tasks import update_next_round
import string
import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_social_oauth2.views import TokenView as SocialTokenView, ConvertTokenView
from oauth2_provider.models import RefreshToken

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
        for s in request.data['swipes']:
            s['user'] = request.data['user']
            swipe = Swipe.objects.filter(yelp_id=s['yelp_id'], user=request.data['user']).first()
            if swipe is not None:
                if 'right_swipe_count' in s.keys():
                    swipe.right_swipe_count += s['right_swipe_count']
                if 'left_swipe_count' in s.keys():
                    swipe.left_swipe_count += s['left_swipe_count']
                swipe.save()
            else:
                serializer = SwipeSerializer(None, data=s)
                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_201_CREATED)


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


class RefreshTokenView(SocialTokenView):
    """
    Refreshes the access token.

    Params: refresh_token

    Adapted from:
    https://github.com/PhilipGarnero/django-rest-framework-social-oauth2/issues/58
    https://github.com/PhilipGarnero/django-rest-framework-social-oauth2/blob/master/rest_framework_social_oauth2/views.py
    """
    def post(self, request, format=None):
        global var_status

        request._request.POST = request._request.POST.copy()

        request._request.POST['grant_type'] = 'refresh_token'
        request._request.POST['client_id'] = settings.SOCIAL_AUTH_CLIENT_ID
        request._request.POST['client_secret'] = settings.SOCIAL_AUTH_CLIENT_SECRET
        request._request.POST['refresh_token'] = request.data.get('refresh_token')

        url, headers, body, var_status = self.create_token_response(request._request)
        data = json.loads(body)

        refresh_token = RefreshToken.objects.filter(token=data.get('refresh_token'))
        if refresh_token.count() != 1:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)

        data['user_id'] = refresh_token[0].user_id

        response = Response(data, status=var_status)

        for k, v in headers.items():
            response[k] = v
        return response


class FcmTokenView(APIView):
    """
    A view to associate the Firebase Cloud Messaging token with the user.
    """
    def put(self, request, user_id, format=None):
        """
        Saves a FCM token for a user.
        """
        try:
            user = User.objects.get(pk=request.user.id)
            fcm_token = request.data.get('fcm_token')

            if fcm_token is None:
                return Response('Bad request', status=status.HTTP_400_BAD_REQUEST)
            user_fcm, created = UserFcm.objects.get_or_create(user_id=request.user.id)
            user_fcm.fcm_token = fcm_token
            user_fcm.save()
            user.user_fcm = user_fcm
            return Response(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response('User not found', status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, user_id, format=None):
        """
        Deletes a FCM token for a user.
        """
        try:
            user = User.objects.get(pk=request.user.id)
            if user.id != request.user.id:
                return Response('Invalid user id', status=status.HTTP_401_UNAUTHORIZED)

            user_fcm = UserFcm.objects.get(user=user.id)
            user_fcm.delete()
            return Response(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response('User not found', status=status.HTTP_404_NOT_FOUND)
        except UserFcm.DoesNotExist:
            return Response('FCM token not found', status=status.HTTP_404_NOT_FOUND)


class EventView(APIView):
    """
    A view to handle event operations.
    """
    TERM = 'restaurants'
    YELP_LIMIT = 50
    DEFAULT_RADIUS = 100
    DEFAULT_NAME = 'Unnamed Event'
    PRICE_THRESHOLDS = [
        {'price': 20, 'yelp_cd': '1'},
        {'price': 40, 'yelp_cd': '2'},
        {'price': 60, 'yelp_cd': '3'},
        {'price': float('inf'), 'yelp_cd': '4'}
    ]
    MAX_PAST_EVENTS = 10

    def get(self, request, user_id, format=None):
        """
        Gets all of the events associated with the user
        """
        if int(user_id) != int(request.user.id):
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
        user_event_ids = EventUserAttach.objects.filter(
            user_id=request.user.id).values_list('event_id', flat=True)

        # Get active events
        active_events = Event.objects.filter(
            pk__in=user_event_ids,
            is_group=True,
            event_detail__datetime__gte=timezone.now()
        ).order_by('-event_detail__datetime')

        # Get the last X past events
        past_events = Event.objects.filter(
            pk__in=user_event_ids,
            is_group=True,
            event_detail__datetime__lt=timezone.now()
        ).order_by('-event_detail__datetime')[0:self.MAX_PAST_EVENTS]

        active_events_serializer = EventSerializer(active_events, many=True)
        active_events_data = active_events_serializer.data
        past_events_serializer = EventSerializer(past_events, many=True)
        past_events_data = past_events_serializer.data

        events_data = active_events_data + past_events_data

        for event in events_data:
            participants = EventUserAttach.objects.filter(event=event['id'])
            event['num_participants'] = participants.count()
            event['participants'] = EventUserAttachSerializer(participants, many=True).data
        return Response(events_data)

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

    def get_invite_code(self):
        """ Generate unique 8-digit invite code """
        code_taken = True
        invite_code = ''
        while code_taken:
            invite_code = ''.join(
                random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
            if EventDetail.objects.filter(invite_code=invite_code).count() == 0:
                code_taken = False
        return invite_code

    def post(self, request, user_id, format=None):
        """
        Creates the specified event for a particular user.
        """
        try:
            user = User.objects.get(pk=user_id)
            if user.id != request.user.id:
                return Response('Invalid user id', status=status.HTTP_401_UNAUTHORIZED)

            prefs_data, params = self.get_prefs_params_data(**request.data)

            # Validate preferences
            preference_serializer = PreferenceSerializer(data=prefs_data)
            if not preference_serializer.is_valid():
                return Response(preference_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            preference = preference_serializer.save()

            # Get restaurants
            restaurants = RecommendationService().get_restaurants(
                user_id=user_id, preference=params)

            if len(restaurants) == 0:
                preference.delete()
                return Response('No restaurants found.', status=status.HTTP_400_BAD_REQUEST)

            # Validate event detail
            invite_code = self.get_invite_code()
            date_time = request.data.get('datetime', timezone.now())
            name = request.data.get('name', self.DEFAULT_NAME)
            event_detail_data = {
                'datetime': date_time if date_time else timezone.now(),
                'name': name if name else self.DEFAULT_NAME,
                'invite_code': invite_code,
                'preference': preference.id
            }

            event_detail_serializer = EventDetailSerializer(
                None, data=event_detail_data, partial=True)
            if not event_detail_serializer.is_valid():
                preference.delete()
                return Response(event_detail_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            event_detail = event_detail_serializer.save()

            # Save cusine preferences
            cuisines = Cuisine.objects.filter(category__in=request.data.get('cuisine_types', []))
            for cuisine in cuisines:
                preference_cuisine = PreferenceCuisine(
                    preference=preference, cuisine=cuisine)
                preference_cuisine.save()

            # Create the event
            round_duration = request.data.get('round_duration', 1)
            event = Event(
                round_num=0,
                event_detail=event_detail,
                creator=user,
                is_group=request.data.get('is_group', False),
                round_duration=round_duration if round_duration else 0,
                randomize_tie=request.data.get('randomize_tie', False)
            )
            event.save()

            # Schedule a job to be run later
            if event.is_group:
                update_next_round.apply_async(args=[event.id], countdown=event.round_duration * 60)

            # Attach the user with the event
            event_user_attach = EventUserAttach(user=user, event=event)
            event_user_attach.save()

            # Create the tournament rounds for the event
            for restaurant in restaurants:
                tournament = Tournament(event=event, restaurant=restaurant, vote_count=0)
                tournament.save()

            response = Response({
                'event_id': event.id,
                'invite_code': invite_code
            }, status=status.HTTP_201_CREATED)
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
        try:
            event_detail = EventDetail.objects.get(invite_code=invite_code)
            event = Event.objects.get(event_detail=event_detail)
            # Check if user has already joined event
            event_user_attach = EventUserAttach.objects.filter(event=event, user=user)
            if event_user_attach.count() == 0:
                event_user_attach = EventUserAttach(user=user, event=event)
                event_user_attach.save()
                if not event.is_group:
                    event.is_group = True
                    event.save()

                # Notify creator of new member
                fcm_service = FcmService()
                title = '{name} updated'.format(name=event_detail.name)
                body = '{first_name} has joined the event {name}'.format(
                    first_name=user.first_name, name=event_detail.name)
                fcm_service.notify_creator(event.creator, title, body)
            else:
                return Response("User has already joined the event", status=status.HTTP_409_CONFLICT)

            serializer = EventSerializer(event)
            resp = serializer.data

            participants = EventUserAttach.objects.filter(event=event)
            resp['num_participants'] = participants.count()
            resp['participants'] = EventUserAttachSerializer(participants, many=True).data
            
            return Response(data=resp, status=status.HTTP_201_CREATED)
        except EventDetail.DoesNotExist:
            return Response("Event detail with this invite code does not exist", status=status.HTTP_404_NOT_FOUND)
        except Event.DoesNotExist:
            return Response("Event does not exist", status=status.HTTP_404_NOT_FOUND)


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
        event_data = serializer.data

        # Retrieve users invited to event
        participants = EventUserAttach.objects.filter(event=event_id)
        event_data['num_participants'] = participants.count()
        event_data['participants'] = EventUserAttachSerializer(participants, many=True).data

        return Response(event_data, status=status.HTTP_200_OK)

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

            fcm_service = FcmService()
            title = '{name} updated'.format(name=event_detail.name)
            body = None
            if 'datetime' in request.data.keys():
                date_str = event_detail.datetime.strftime(fcm_service.DATETIME_FORMAT)
                body = '{first_name} updated the event date to {date}'.format(
                    first_name=event.creator.first_name, date=date_str)
            elif 'name' in request.data.keys():
                name_str = event_detail.name
                body = '{first_name} updated the event name to {name}'.format(
                    first_name=event.creator.first_name, name=name_str)

            fcm_service.notify_all_participants(event.id, title, body)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id, event_id, format=None):
        if User.objects.filter(id=user_id).count() == 0:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
        event, event_detail = self.get_object(event_id)
        event_user_attaches = EventUserAttach.objects.filter(event=event)

        if event.creator.id != long(user_id):
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)

        # Notify event participants of the deletion
        fcm_service = FcmService()
        title = '{name} deleted'.format(name=event_detail.name)
        body = '{first_name} has deleted the event {name}'.format(
            first_name=event.creator.first_name, name=event_detail.name)
        fcm_service.notify_all_participants(event.id, title, body)

        if event_user_attaches.count() > 0:
            event_user_attaches.delete()
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

    def get_user(self, user_id):
        try:
            user = User.objects.get(pk=user_id)
            return user
        except User.DoesNotExist:
            return Response("User does not exist", status=status.HTTP_404_NOT_FOUND)

    def update_next_round(self, event, tournament_data):
        num_participants = EventUserAttach.objects.filter(event=event.id).count()
        round_completed = True
        if event.is_group:
            if event.round_num == 0:
                return False
            if ((timezone.now() - event.round_start).total_seconds() / 3600) < event.round_duration:
                tournaments = Tournament.objects.filter(event=event)
                for t in tournaments:
                    tournament1 = t
                    tournament2 = t.competitor if t is not None else None
                    if tournament2 is None:
                        return False
                    if tournament1.vote_count + tournament2.vote_count != num_participants:
                        round_completed = False

        if not round_completed:
            return False

        event.round_num += 1
        event.round_start = timezone.now()
        event.save()
        # Schedule a job to be run later
        if event.is_group:
            update_next_round.apply_async(args=[event.id], countdown=event.round_duration * 3600)

        num_remaining = 0
        winner = None
        # Update restaurants for next tournament round
        tournaments = Tournament.objects.filter(event=event)
        if event.round_num == 1:
            for t in tournaments:
                tournament = Tournament.objects.get(pk=t.id)
                if tournament.vote_count > 0:
                    tournament.vote_count = 0
                    num_remaining += 1
                    tournament.save()
                    winner = tournament.restaurant
                else:
                    tournament.delete()
        else:
            computed = []
            to_delete = []
            for t in tournaments:
                tournament1 = t
                tournament2 = t.competitor if t is not None else None
                
                if tournament2 is None or tournament1.id in computed or tournament2.id in computed:
                    continue
                if tournament1.vote_count == tournament2.vote_count:
                    # Randomize winner if there is a tie
                    if len(tournament_data) == 1 and event.randomize_tie:
                        rand_index = random.choice([0, 1])
                        if rand_index:
                            tournament2.vote_count = 0
                            tournament2.competitor = None
                            tournament2.save()
                            winner = tournament2.restaurant
                            to_delete.append(tournament1)
                        else:
                            tournament1.vote_count = 0
                            tournament1.competitor = None
                            tournament1.save()
                            winner = tournament1.restaurant
                            to_delete.append(tournament2)
                        num_remaining += 1
                    else:
                        tournament1.vote_count = 0
                        tournament1.competitor = None
                        tournament1.save()
                        tournament2.vote_count = 0
                        tournament2.competitor = None
                        tournament2.save()
                        num_remaining += 2
                elif tournament1.vote_count > tournament2.vote_count:
                    tournament1.vote_count = 0
                    tournament1.competitor = None
                    tournament1.save()
                    num_remaining += 1
                    winner = tournament1.restaurant
                    to_delete.append(tournament2)
                else:
                    tournament2.vote_count = 0
                    tournament2.competitor = None
                    tournament2.save()
                    num_remaining += 1
                    winner = tournament2.restaurant
                    to_delete.append(tournament1)
                    # tournament1.delete()
                computed.append(tournament2.id)
                computed.append(tournament1.id)

            for t in to_delete:
                t.delete()
        # If only 1 restaurant left, then update event details with the winner.
        if Tournament.objects.filter(event=event).count() == 1:
            event_details = event.event_detail
            event_details.restaurant = winner
            event_details.save()

            # Notify participants of update
            if event.is_group:
                fcm_service = FcmService()
                title = '{name} updated'.format(name=event_details.name)
                restaurant_data = json.loads(event_details.restaurant.json)
                winner_str = restaurant_data['name']
                body = '{first_name} updated the winning restaurant to {name}'.format(
                    first_name=event.creator.first_name, name=winner_str)

                fcm_service.notify_all_participants(event.id, title, body)

        return True

    def get(self, request, event_id, format=None):
        """
        Gets the tournament restaurants that will participate in a tournament
        round. In round 0, only a list of restaurants participate. In later
        rounds, restaurants are paired up.
        """
        event = self.get_object(event_id)

        # Check if user has already voted for this round
        user = request.user
        event_user_attach = EventUserAttach.objects.get(event=event, user=user)
        if event_user_attach.last_round_voted == event.round_num:
            return Response("User has already voted", status=status.HTTP_409_CONFLICT)

        tournaments = Tournament.objects.filter(event_id=event_id)
        data = TournamentSerializer(tournaments, many=True).data

        # If round 0, then return list of restaurants (no pairings)
        if event.round_num == 0:
            return Response(data)

        # Tournament restaurants swiping stage
        paired_tournaments_data = [list(x) for x in zip(
            data[:len(data)/2], data[len(data)/2:])]

        # Store pairings in database
        for p in paired_tournaments_data:
            t1 = Tournament.objects.get(pk=p[0]['id'])
            t2 = Tournament.objects.get(pk=p[1]['id'])
            t1.competitor = t2
            t2.competitor = t1
            t1.save()
            t2.save()

        # If there are odd number of restaurants, then carry the extra one to next round.
        if len(data) % 2 != 0:
            tournament = Tournament.objects.get(pk=data[len(data) - 1]['id'])
            tournament.vote_count = 0
            tournament.save()
            if len(paired_tournaments_data) == 0:
                return Response(data)

        return Response(paired_tournaments_data)

    def put(self, request, event_id, format=None):
        """
        Increments the vote count of a tournament restaurant.
        """
        try:
            tournaments = Tournament.objects.filter(event=event_id)
            for t in tournaments:
                if t.id in request.data['tournaments']:
                    t.vote_count += 1
                    t.save()

            # Check if tournament round is over. If so, handle it.
            if 'is_finished' in request.data.keys() and request.data['is_finished']:
                event = self.get_object(event_id)
                user = request.user
                event_user_attach = EventUserAttach.objects.get(event=event, user=user)
                event_user_attach.last_round_voted += 1
                event_user_attach.save()

                is_round_over = self.update_next_round(event, request.data['tournament_data'])
                if is_round_over:
                    return Response({'Next': 1}, status=status.HTTP_200_OK)
            return Response({'Next': 0}, status=status.HTTP_200_OK)
        except Tournament.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class EventUserAttachView(APIView):
    def put(self, request, user_id, event_id):
        """Updates rating of a user's event. User can rate the restaurant that the event is attached to"""
        try:
            event = Event.objects.get(pk=event_id)
            user = User.objects.get(pk=user_id)
            attach = EventUserAttach.objects.get(event=event, user=user)
            attach.rating = request.data['rating']
            attach.save()

            yelp_id = event.event_detail.restaurant.yelp_id

            user_swipe = Swipe.objects.get(
                user=user, 
                yelp_id=yelp_id)

            avg_rating = EventUserAttach.objects.filter(
                user=user,
                event__event_detail__restaurant__yelp_id=yelp_id,
                rating__gt=0
            ).aggregate(avg_rating=Avg('rating')).get('avg_rating')

            user_swipe.avg_rating = avg_rating
            user_swipe.save()
            
            return Response({'rating': attach.rating}, status=status.HTTP_200_OK)
        except Event.DoesNotExist:
            return Response("Event does not exist", status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response("User does not exist", status=status.HTTP_404_NOT_FOUND)
        except EventUserAttach.DoesNotExist:
            return Response("EventUserAttach does not exist", status=status.HTTP_404_NOT_FOUND)
