import json
from datetime import datetime

from django.conf import settings
from django.contrib.auth.models import User
from server.favoureat.serializers import (
    UserSerializer,
    SwipeSerializer,
    RestaurantSerializer,
    TournamentSerializer
)
from server.models import (
    Swipe,
    Restaurant,
    Event,
    EventDetail,
    Preference,
    PreferenceCuisine,
    Tournament
)
from server.favoureat.recommendation_service import RecommendationService
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
        swipe = Swipe.objects.filter(yelp_id=request.data['yelp_id'], user=request.data['user'])
        if swipe.exists():
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
        global status
        if request.user.id is None:
            return Response('User not created', status=status.HTTP_400_BAD_REQUEST)
        request._request.POST = request._request.POST.copy()

        request._request.POST['grant_type'] = 'convert_token'
        request._request.POST['client_id'] = settings.SOCIAL_AUTH_CLIENT_ID
        request._request.POST['client_secret'] = settings.SOCIAL_AUTH_CLIENT_SECRET
        request._request.POST['backend'] = 'facebook'
        request._request.POST['token'] = request.data.get('access_token')

        url, headers, body, status = self.create_token_response(request._request)
        data = json.loads(body)
        data['user_id'] = request.user.id
        response = Response(data, status=status)

        for k, v in headers.items():
            response[k] = v
        return response


class IndividualEventView(APIView):
    """
    A class to handle event operations.
    """
    TERM = 'restaurants'
    YELP_LIMIT = 50
    PRICE_THRESHOLDS = [
        {'price': 20, 'yelp_cd': '1'},
        {'price': 40, 'yelp_cd': '2'},
        {'price': 60, 'yelp_cd': '3'},
        {'price': float('inf'), 'yelp_cd': '4'}
    ]

    def post(self, request, user_id, format=None):
        """
        Gets the specified event for a particular user.
        """
        categories = request.data.get('cuisine_type')
        radius = request.data.get('radius') # Meters
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        preference = Preference(radius=radius, latitude=latitude, longitude=longitude)
        preference.save()

        event_detail = EventDetail(
            datetime=datetime.now(),
            name=request.data.get('name'),
            preference=preference
        )
        event_detail.save()

        user = User.objects.get(pk=user_id)
        event = Event(user=user, event_detail=event_detail, round_num=0)
        event.save()

        params = {
            'term': self.TERM,
            'categories': categories,
            'radius': radius,
            'latitude': latitude,
            'longitude': longitude,
            'limit': self.YELP_LIMIT
        }

        max_price = request.data.get('max_price')
        if max_price is not None:
            for threshold in self.PRICE_THRESHOLDS:
                if max_price <= threshold['price']:
                    params['price'] = threshold['yelp_cd']
                    break

        # Create the tournament rounds for the event
        restaurants = RecommendationService().get_restaurants(user_id=user_id, preference=params)

        for restaurant in restaurants:
            tournament = Tournament(event=event, restaurant=restaurant, vote_count=0)
            tournament.save()

        response = Response(status=status.HTTP_201_CREATED)
        response['Location'] = '/v1/events/{id}'.format(id=event.id)
        return response


class IndividualTournamentView(APIView):
    """
    A class to handle the retrieval and updating of tournament information.

    HTTP methods: GET, PUT
    """
    def get(self, request, event_id, format=None):
        """
        Gets the tournament restaurants that will participate in a tournament
        round. In round 0, only a list of restaurants participate. In later
        rounds, restaurants are paired up.
        """

        tournaments = Tournament.objects.filter(event_id=event_id)
        data = TournamentSerializer(tournaments, many=True).data

        # Single restaurant swiping stage
        # return Response(data)
        # TODO: Handle round 0 and round > 0

        # Tournament restaurants swiping stage
        # TODO: Handle odd number of restaurants
        paired_tournaments_data = [list(x) for x in zip(
            data[:len(data)/2], data[len(data)/2:])]

        return Response(paired_tournaments_data)

    def put(self, request, event_id, tournament_id, format=None):
        """
        Increments the vote count of a tournament restaurant.
        """
        try:
            tournament = Tournament.objects.get(pk=tournament_id)
            tournament.vote_count += 1
            tournament.save()
            return Response()
        except Tournament.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
