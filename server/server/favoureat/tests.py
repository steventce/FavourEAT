from mock import patch
from django.utils import timezone
from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate
from rest_framework import status
from server.models import (
    Swipe,
    Restaurant,
    Event,
    EventDetail,
    Preference,
    UserFcm,
    EventUserAttach,
    Tournament,
    Cuisine,
    PreferenceCuisine
)
from django.contrib.auth.models import User
from server.favoureat import views
from server.favoureat import yelp_api_service
import datetime


class UserTests(APITestCase):
    def test_success_get_user(self):
        """ Ensure that a user can be retrieved """
        name = 'bob'
        user = User.objects.create(username=name)
        self.assertEqual(User.objects.count(), 1)

        url = ''.join(['/v1/users', '/', str(user.id)])
        factory = APIRequestFactory()
        request = factory.get(url)
        force_authenticate(request, user=user)

        view = views.UserView.as_view()
        response = view(request, user_id=user.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected = {'first_name': '', 'last_name': '', 'id': user.id}
        self.assertEqual(response.data, expected)

    def test_error_no_token(self):
        """ Ensure that the endpoint requires an access token """
        user_id = 2
        User.objects.create(pk=user_id, username='bob')
        self.assertEqual(User.objects.count(), 1)

        url = ''.join(['/v1/users', '/', str(user_id)])
        response = self.client.get(url, follow=True, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TokenTests(APITestCase):
    def test_error_invalid_token(self):
        """ Ensure that an invalid client token throws an error """
        data = {
            'access_token': 'IrboBALZBYWtfMQSeHmxZBZBbDwsqPpIfl3ySsgaOlwEnZCmpc'
        }
        url = '/v1/token/'
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_error_no_token(self):
        """ Ensure that an error is handled elegantly when there is no access token """
        data = {'access_token': ''}
        url = '/v1/token/'
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_error_invalid_force_auth(self):
        """ Ensure that an invalid client token throws an error even with force authenticate """
        user = User(username='john_doe')
        user.save()
        factory = APIRequestFactory()
        request = factory.post('/v1/token/', data={'access_token': 'LJG15SJG9KDDZ'}, format='json')
        force_authenticate(request, user=user)
        view = views.TokenView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['user_id'], user.id)


class UserFcmTests(APITestCase):
    FCM_TOKEN = 'ALJG1ZlLY1K01'
    URL = '/v1/users/{id}/fcm-token/'

    def request_fcm_helper(self, user, method):
        """
        A helper for creating FCM requests

        Args:
            user (User): The User object
            method (dict): Options for sending a request
                - name (str): Name of the method
                - authenticate (bool): Whether to authenticate the request
                - data (dict): Dictionary of data params

        Returns:
            Response object with request response data
        """
        url = self.URL.format(id=user.id)
        factory = APIRequestFactory()

        request = None
        if method['name'] == 'PUT':
            request = factory.put(url, method.get('data', {}), format='json')
        elif method['name'] == 'DELETE':
            request = factory.delete(url)
        else:
            print 'No method exists for fcm view'
            return

        if method.get('authenticate', True):
            force_authenticate(request, user=user)

        view = views.FcmTokenView.as_view()
        response = view(request, user_id=user.id)
        return response

    def test_error_no_token(self):
        """ Ensure that an invalid client token throws an error """
        user = User(username='bob_jones')
        user.save()

        response = self.request_fcm_helper(user, {'name': 'PUT', 'authenticate': False})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.request_fcm_helper(user, {'name': 'DELETE', 'authenticate': False})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_error_no_fcm_token(self):
        """ Ensure that without a FCM token it throws an error """
        user = User(username='bob_jones')
        user.save()

        response = self.request_fcm_helper(user, {
            'name': 'PUT',
            'data': {}
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_save_fcm_token(self):
        """ Ensure that an fcm token can be saved successfully """
        user = User(username='bob_jones')
        user.save()

        response = self.request_fcm_helper(user, {
            'name': 'PUT',
            'data': {'fcm_token': self.FCM_TOKEN}
        })
        fcm_token = User.objects.get(pk=user.id).userfcm.fcm_token

        self.assertEqual(fcm_token, self.FCM_TOKEN)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_fcm_token(self):
        """ Ensure that an fcm token can be deleted successfully """
        user = User(username='bob_jones')
        user.save()

        user_fcm = UserFcm(fcm_token=self.FCM_TOKEN, user=user)
        user_fcm.save()

        response = self.request_fcm_helper(user, {'name': 'DELETE'})
        self.assertFalse(hasattr(User.objects.get(pk=user.id), 'userfcm'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.request_fcm_helper(user, {'name': 'DELETE'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UserSwipeTests(APITestCase):
    def test_save_swipe(self):
        """ Ensure we can save a user swipe decision """
        user = User.objects.create(pk='139530')
        user.save()

        swipe_data = [{
                'yelp_id': 'yelp_business',
                'right_swipe_count': 1,
                'left_swipe_count': 0}]
        data = {'user': user.id, 'swipes': swipe_data}
        url = '/v1/users/' + str(data['user']) + '/swipes/'

        factory = APIRequestFactory()
        request = factory.post(url, data, format='json')
        force_authenticate(request, user=user)
        view = views.UserSwipeView.as_view()
        response = view(request, user=user.id)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Swipe.objects.count(), 1)
        self.assertEqual(Swipe.objects.get().yelp_id, swipe_data[0]['yelp_id'])
        self.assertEqual(Swipe.objects.get().right_swipe_count, swipe_data[0]['right_swipe_count'])
        self.assertEqual(Swipe.objects.get().left_swipe_count, swipe_data[0]['left_swipe_count'])

    def test_error_save_swipe(self):
        """ Ensure that error occurs if we try to save a swipe decision with nonexisting user """
        user = User.objects.create(pk='139530')
        user.save()

        swipe_data = [{
                'yelp_id': 54623,
                'right_swipe_count': 9,
                'left_swipe_count': 0}]
        data = {'user': 16, 'swipes': swipe_data}
        url = '/v1/users/' + str(data['user']) + '/swipes/'

        factory = APIRequestFactory()
        request = factory.post(url, data, format='json')
        force_authenticate(request, user=user)
        view = views.UserSwipeView.as_view()
        response = view(request, user=data['user'])

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_malformed_save_swipe(self):
        """ Ensure that error occurs if we try to save a swipe decision when data is malformed """
        user = User(pk='139530')
        user.save()

        swipe_data = [{
                'yelp_id': 54623,
                'right_swipe_count': 'hello',
                'left_swipe_count': 'goodbye'}]
        data = {'user': user.id, 'swipes': swipe_data}
        url = '/v1/users/' + str(data['user']) + '/swipes/'

        factory = APIRequestFactory()
        request = factory.post(url, data, format='json')
        force_authenticate(request, user=user)
        view = views.UserSwipeView.as_view()
        response = view(request, user=user.id)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ClearRestaurantCacheTests(TestCase):
    def test_clear_restaurant_cache(self):
        """ Ensure that the clear cache command removes the json from the Restaurant table """
        data = '{"days_of_week": 7}'
        Restaurant.objects.create(yelp_id='My Restaurant', json=data)
        self.assertEqual(data, Restaurant.objects.get().json)
        call_command('clear_restaurant_cache')
        self.assertEqual(None, Restaurant.objects.get().json)


class EventTests(APITestCase):
    data = {
        'radius': 100, 'latitude': 49, 'longitude': -123, 'min_price': 10,
        'max_price': 50, 'name': 'Test', 'cuisine_types': ['chinese', 'pizza'],
        'datetime': timezone.now(), 'round_duration': 5
    }

    def event_helper(self, user, data, authenticate, method='GET'):
        """ Helper to post to the create event endpoint """
        user_id = user.id
        url = 'v1/users/{user_id}/events'.format(user_id=str(user_id))
        factory = APIRequestFactory()
        request = factory.post(url, data, format='json') if method == 'POST' else factory.get(url)

        if authenticate:
            force_authenticate(request, user)
        view = views.EventView.as_view()
        response = view(request, user_id=user_id)
        return response

    def create_events(self, user, num_events):
        events = []
        for index in xrange(num_events):
            preference = Preference(radius=1, latitude=2, longitude=3)
            preference.save()

            event_detail = EventDetail(
                datetime=timezone.now(),
                name='My Event Detail {index}'.format(index=index),
                preference=preference
            )
            event_detail.save()

            event = Event(
                round_num=0,
                event_detail=event_detail,
                creator=user,
                is_group=True,
                round_duration=0
            )
            event.save()
            events.append(event)
            user.eventuserattach_set.create(event=event, user=user)
        return events

    def create_restaurants(self):
        restaurants = Restaurant.objects.bulk_create([
            Restaurant(yelp_id='Cheap Foods'),
            Restaurant(yelp_id='Some Pizza'),
            Restaurant(yelp_id='Good Rice')
        ])
        return restaurants

    @patch('server.favoureat.recommendation_service.RecommendationService.get_restaurants')
    def test_generate_invite_code(self, get_restaurants_mock):
        """ Ensure that an 8-digit unique invite code is generated when creating an event """
        user = User(username='bob_jones')
        user.save()
        preference = Preference(radius=1, latitude=2, longitude=3)
        preference.save()

        get_restaurants_mock.return_value = self.create_restaurants()
        response = self.event_helper(user, self.data, True, method='POST')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data['invite_code']), 8)

    def test_get_user_events(self):
        """ Ensures that a user can successfully retrieve their events """
        expected_len = 5
        user = User(username='bob_jones')
        user.save()

        events = self.create_events(user, expected_len)
        response = self.event_helper(user, None, True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), expected_len)

        event_data_ids = [e['id'] for e in response.data]
        event_ids = [e.id for e in events]
        # Check ordered by date desc
        self.assertSequenceEqual(event_data_ids, event_ids[::-1])

        for event_data in response.data:
            self.assertEqual(event_data['round_duration'], 0)
            self.assertEqual(event_data['is_group'], True)
            self.assertEqual(event_data['round_duration'], 0)

    def test_event_save_no_token(self):
        """ Ensure that an unauthorized error occurs with no authentication """
        user = User(username='bob_jones')
        user.save()
        response = self.event_helper(user, None, False, 'POST')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_event_save_no_params(self):
        """ Ensure that a 400 response is returned when there are no params """
        user = User(username='bob_jones')
        user.save()
        response = self.event_helper(user, {}, True, 'POST')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('server.favoureat.recommendation_service.RecommendationService.get_restaurants')
    def test_event_save_pref(self, get_restaurants_mock):
        """ Ensure that preferences are saved correctly when creating an event """
        user = User(username='bob_jones')
        user.save()
        # Mock out the Yelp API call
        get_restaurants_mock.return_value = self.create_restaurants()

        response = self.event_helper(user, self.data, True, 'POST')
        event = Event.objects.get(creator=user.id)
        self.assertEqual(event.event_detail.name, self.data['name'])

        preference = event.event_detail.preference

        self.assertEqual(preference.radius, self.data['radius'])
        self.assertEqual(preference.latitude, self.data['latitude'])
        self.assertEqual(preference.longitude, self.data['longitude'])
        self.assertEqual(preference.min_price, self.data['min_price'])
        self.assertEqual(preference.max_price, self.data['max_price'])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch('server.favoureat.recommendation_service.RecommendationService.get_restaurants')
    def test_event_save_pref_cuisines(self, get_restaurants_mock):
        """ Ensure that cuisine preferences are saved correctly when creating an event """
        user = User(username='bob_jones')
        user.save()
        # Mock out the Yelp API call
        get_restaurants_mock.return_value = self.create_restaurants()

        # Add cuisines
        pizza_cuisine = Cuisine(category='pizza', name='Pizza')
        chinese_cuisine = Cuisine(category='chinese', name='Chinese')
        pizza_cuisine.save()
        chinese_cuisine.save()

        self.event_helper(user, self.data, True, 'POST')
        pizza_pref_qs = PreferenceCuisine.objects.filter(cuisine=pizza_cuisine)
        pizza_pref = pizza_pref_qs.first()

        self.assertEqual(pizza_pref_qs.count(), 1)
        self.assertEqual(pizza_pref.cuisine.category, 'pizza')
        self.assertEqual(pizza_pref.cuisine.name, 'Pizza')

    @patch('server.favoureat.recommendation_service.RecommendationService.get_restaurants')
    def test_event_save_detail(self, get_restaurants_mock):
        """ Ensure that event details are saved correctly when creating an event """
        user = User(username='bob_jones')
        user.save()
        # Mock out the Yelp API call
        get_restaurants_mock.return_value = self.create_restaurants()

        response = self.event_helper(user, self.data, True, 'POST')
        event = Event.objects.get(creator=user.id)
        self.assertEqual(event.event_detail.name, self.data['name'])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch('server.favoureat.recommendation_service.RecommendationService.get_restaurants')
    def test_event_save_attach(self, get_restaurants_mock):
        """ Ensure that event user attach is saved correctly when creating an event """
        user = User(username='bob_jones')
        user.save()
        # Mock out the Yelp API call
        get_restaurants_mock.return_value = self.create_restaurants()

        response = self.event_helper(user, self.data, True, 'POST')
        event = Event.objects.get(creator=user.id)
        self.assertEqual(event.eventuserattach_set.first().user_id, user.id)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch('server.favoureat.recommendation_service.RecommendationService.get_restaurants')
    def test_event_save_tournament(self, get_restaurants_mock):
        """ Ensure that tournaments are saved correctly when creating an event """
        user = User(username='bob_jones')
        user.save()
        restaurants = self.create_restaurants()
        restaurant_ids = [r.id for r in restaurants]
        get_restaurants_mock.return_value = restaurants

        response = self.event_helper(user, self.data, True, 'POST')
        event = Event.objects.get(creator=user.id)

        self.assertEqual(len(event.tournament_set.values()), len(restaurants))
        for tournament in event.tournament_set.values():
            self.assertTrue(tournament['restaurant_id'] in restaurant_ids)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class JoinEventTests(APITestCase):
    def join_event_helper(self, user, data, authenticate):
        """ Helper to post to the create event endpoint """
        url = 'v1/users/{user_id}/join/{invite_code}'.format(user_id=str(user.id), invite_code=data['invite_code'])
        factory = APIRequestFactory()
        request = factory.post(url, {}, format='json')

        if authenticate:
            force_authenticate(request, user)
        view = views.JoinEventView.as_view()
        response = view(request, user_id=user.id, invite_code=data['invite_code'])
        return response

    def test_join_event_success(self):
        """ Ensure that user can join an event using an invite code """
        user = User(username='testuser')
        user.save()
        pref = Preference(radius=2, latitude=10, longitude=10)
        pref.save()
        event_detail = EventDetail(preference=pref,
                                   datetime=timezone.now(),
                                   name="My event details",
                                   description="Cool event",
                                   invite_code="8UF1H02P")
        event_detail.save()
        event = Event(creator=user, event_detail=event_detail)
        event.save()

        user1 = User(username='testuser123')
        user1.save()

        response = self.join_event_helper(user1, {'invite_code': '8UF1H02P'}, True)

        event_user_attach = EventUserAttach.objects.filter(event=event, user=user1)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(1, event_user_attach.count())

    def test_join_event_already_joined(self):
        """ Ensure that user can join an event using an invite code """
        user = User(username='testuser')
        user.save()
        pref = Preference(radius=2, latitude=10, longitude=10)
        pref.save()
        event_detail = EventDetail(preference=pref,
                                   datetime=timezone.now(),
                                   name="My event details",
                                   description="Cool event",
                                   invite_code="8UF1H02P")
        event_detail.save()
        event = Event(creator=user, event_detail=event_detail)
        event.save()

        user1 = User(username='testuser123')
        user1.save()
        attach = EventUserAttach(user=user1, event=event)
        attach.save()

        response = self.join_event_helper(user1, {'invite_code': '8UF1H02P'}, True)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_join_event_invalid_code(self):
        """ Ensure that user cannot join an event if invite code does not map to an event """
        user = User(username='testuser')
        user.save()
        pref = Preference(radius=2, latitude=10, longitude=10)
        pref.save()
        event_detail = EventDetail(preference=pref,
                                   datetime=timezone.now(),
                                   name="My event details",
                                   description="Cool event",
                                   invite_code="8UF1H02P")
        event_detail.save()
        event = Event(creator=user, event_detail=event_detail)
        event.save()

        response = self.join_event_helper(user, {'invite_code': '8UA0IE12'}, True)

        event_user_attach = EventUserAttach.objects.filter(event=event, user=user)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(0, event_user_attach.count())

    def test_join_event_invalid_event(self):
        """ Ensure that user can join an event using an invite code """
        user = User(username='testuser')
        user.save()
        pref = Preference(radius=2, latitude=10, longitude=10)
        pref.save()
        event_detail = EventDetail(preference=pref,
                                   datetime=timezone.now(),
                                   name="My event details",
                                   description="Cool event",
                                   invite_code="8UF1H02P")
        event_detail.save()

        response = self.join_event_helper(user, {'invite_code': '8UF1H02P'}, True)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TestEventDetails(APITestCase):
    def generate_event_details_helper(self):
        user = User(username='testuser')
        user.save()
        pref = Preference(radius=2, latitude=10, longitude=10)
        pref.save()
        event_detail = EventDetail(preference=pref,
                                   datetime=timezone.now(),
                                   name="My event details",
                                   description="Cool event",
                                   invite_code="8UF1H02P")
        event_detail.save()
        event = Event(creator=user, event_detail=event_detail)
        event.save()
        return user, event_detail, event

    def request_helper(self, user, event, authenticate, data=None, method='GET'):
        url = 'v1/users/{user_id}/events/{event_id}'.format(user_id=str(user.id), event_id=str(event.id))
        factory = APIRequestFactory()
        request = None
        if method == 'GET':
            request = factory.get(url)
        elif method == 'PUT':
            request = factory.put(url, data, format='json')
        elif method == "DELETE":
            request = factory.delete(url, format='json')

        if authenticate:
            force_authenticate(request, user)
        view = views.EventDetailsView.as_view()
        response = view(request, user_id=user.id, event_id=event.id)
        return response

    def test_get_event_details(self):
        user, event_detail, event = self.generate_event_details_helper()

        response = self.request_helper(user, event, True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(event_detail.name, response.data['name'])
        self.assertEqual(event_detail.description, response.data['description'])
        self.assertEqual(event_detail.invite_code, response.data['invite_code'])

    def test_get_event_details_invalid_user(self):
        _, event_detail, event = self.generate_event_details_helper()
        user = User(username='testuser1')

        response = self.request_helper(user, event, True)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_change_event_name_success(self):
        """Ensure that event details are updated successfully"""
        user, event_detail, event = self.generate_event_details_helper()
        data = {'name': 'New event detail name'}
        response = self.request_helper(user, event, True, data=data, method='PUT')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(data['name'], response.data['name'])

    def test_change_event_datetime_success(self):
        """Ensure that event details are updated successfully"""
        user, event_detail, event = self.generate_event_details_helper()
        data = {'datetime': datetime.datetime(2016, 02, 02)}
        response = self.request_helper(user, event, True, data=data, method='PUT')
        exists = str(data['datetime'].date()) in response.data['datetime']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(exists, True)

    def test_change_event_not_creator(self):
        """Ensure non-creator cannot update event details"""
        user1 = User(username='hei')
        user1.save()
        user, event_detail, event = self.generate_event_details_helper()
        data = {'datetime': datetime.datetime(2016, 02, 02)}
        response = self.request_helper(user1, event, True, data=data, method='PUT')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_event_invalid_user(self):
        """Ensure non-creator cannot update event details"""
        user1 = User(username='hei')
        user, event_detail, event = self.generate_event_details_helper()
        data = {'datetime': datetime.datetime(2016, 02, 02)}
        response = self.request_helper(user1, event, True, data=data, method='PUT')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_event_success(self):
        """Ensure creator can delete event"""
        user, event_detail, event = self.generate_event_details_helper()
        response = self.request_helper(user, event, True, data=None, method='DELETE')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_event_failure(self):
        """Ensure non-creator cannot delete event"""
        user1 = User(username='hei')
        user1.save()
        user, event_detail, event = self.generate_event_details_helper()
        response = self.request_helper(user1, event, True, data=None, method='DELETE')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class IndividualTournamentTest(APITestCase):
    def generate_tournament_helper(self, round_num=0):
        user = User(username='testuser')
        user.save()
        pref = Preference(radius=2, latitude=10, longitude=10)
        pref.save()
        event_detail = EventDetail(preference=pref,
                                   datetime=timezone.now(),
                                   name="My event details",
                                   description="Cool event",
                                   invite_code="8UF1H02P")
        event_detail.save()
        event = Event(creator=user, event_detail=event_detail, round_num=round_num)
        event.save()
        user1 = User(username='test1')
        user2 = User(username='test2')
        user1.save()
        user2.save()
        user_attach = EventUserAttach(event=event, user=user1)
        user_attach.save()
        user_attach2 = EventUserAttach(event=event, user=user2)
        user_attach2.save()

        return user, event

    def request_helper_get(self, user, event, authenticate):
        factory = APIRequestFactory()
        url = 'v1/events/{event_id}/tournament'.format(event_id=str(event.id))
        request = factory.get(url)

        if authenticate:
            force_authenticate(request, user)
        view = views.IndividualTournamentView.as_view()
        response = view(request, event_id=event.id)
        return response

    def request_helper_put(self, user, event, authenticate, data):
        factory = APIRequestFactory()
        url = 'v1/events/{event_id}/tournament/'.format(event_id=str(event.id))
        request = factory.put(url, data, format='json')

        if authenticate:
            force_authenticate(request, user)
        view = views.IndividualTournamentView.as_view()
        response = view(request, event_id=event.id)
        return response

    def test_get_tournament_first_round_success(self):
        """Ensure user can get tournament info"""
        user, event = self.generate_tournament_helper()
        restaurant1 = Restaurant(yelp_id="1234", json='{"name": "Miku"}')
        restaurant2 = Restaurant(yelp_id="1235", json='{"name": "Sushi California"}')
        restaurant3 = Restaurant(yelp_id="1236", json='{"name": "Mcdonalds"}')
        restaurant1.save()
        restaurant2.save()
        restaurant3.save()
        tournament1 = Tournament(event=event, restaurant=restaurant1, vote_count=0)
        tournament2 = Tournament(event=event, restaurant=restaurant2, vote_count=0)
        tournament3 = Tournament(event=event, restaurant=restaurant3, vote_count=0)
        tournament1.save()
        tournament2.save()
        tournament3.save()

        response = self.request_helper_get(user, event, True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_get_tournament_first_round_success(self):
        """Ensure user can get tournament info"""
        user, event = self.generate_tournament_helper()
        attach = EventUserAttach(event=event, user=user)
        attach.save()
        restaurant1 = Restaurant(yelp_id="1234", json='{"name": "Miku"}')
        restaurant2 = Restaurant(yelp_id="1235", json='{"name": "Sushi California"}')
        restaurant3 = Restaurant(yelp_id="1236", json='{"name": "Mcdonalds"}')
        restaurant1.save()
        restaurant2.save()
        restaurant3.save()
        tournament1 = Tournament(event=event, restaurant=restaurant1, vote_count=0)
        tournament2 = Tournament(event=event, restaurant=restaurant2, vote_count=0)
        tournament3 = Tournament(event=event, restaurant=restaurant3, vote_count=0)
        tournament1.save()
        tournament2.save()
        tournament3.save()

        response = self.request_helper_get(user, event, True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_get_tournament_second_round_success(self):
        """Ensure user can get tournament info"""
        user, event = self.generate_tournament_helper(round_num=1)
        attach = EventUserAttach(event=event, user=user)
        attach.save()
        restaurant1 = Restaurant(yelp_id="1234", json='{"name": "Miku"}')
        restaurant2 = Restaurant(yelp_id="1235", json='{"name": "Sushi California"}')
        restaurant3 = Restaurant(yelp_id="1236", json='{"name": "Mcdonalds"}')
        restaurant1.save()
        restaurant2.save()
        restaurant3.save()
        tournament1 = Tournament(event=event, restaurant=restaurant1, vote_count=0)
        tournament2 = Tournament(event=event, restaurant=restaurant2, vote_count=0)
        tournament3 = Tournament(event=event, restaurant=restaurant3, vote_count=0)
        tournament1.save()
        tournament2.save()
        tournament3.save()

        response = self.request_helper_get(user, event, True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_tournament_error(self):
        """Ensure user can't vote if they have already voted"""
        user, event = self.generate_tournament_helper()
        attach = EventUserAttach(event=event, user=user, last_round_voted=0)
        attach.save()
        restaurant1 = Restaurant(yelp_id="1234", json='{"name": "Miku"}')
        restaurant2 = Restaurant(yelp_id="1235", json='{"name": "Sushi California"}')
        restaurant3 = Restaurant(yelp_id="1236", json='{"name": "Mcdonalds"}')
        restaurant1.save()
        restaurant2.save()
        restaurant3.save()
        tournament1 = Tournament(event=event, restaurant=restaurant1, vote_count=0)
        tournament2 = Tournament(event=event, restaurant=restaurant2, vote_count=0)
        tournament3 = Tournament(event=event, restaurant=restaurant3, vote_count=0)
        tournament1.save()
        tournament2.save()
        tournament3.save()
        response = self.request_helper_get(user, event, True)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_update_tournament_success(self):
        """Ensure user can vote in a tournament"""
        user, event = self.generate_tournament_helper()
        restaurant1 = Restaurant(yelp_id="4562", json='{"name": "Miku"}')
        restaurant1.save()
        tournament1 = Tournament(event=event, restaurant=restaurant1, vote_count=1)
        tournament1.save()

        response = self.request_helper_put(user, event, True, {"tournaments": [tournament1.id]})
        result = Tournament.objects.get(pk=tournament1.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['Next'], 0)
        self.assertEqual(result.vote_count, 2)

    def test_next_round_success_t1(self):
        """Ensure we move to next round successfully"""
        user, event = self.generate_tournament_helper(round_num=1)
        attach = EventUserAttach(event=event, user=user)
        attach.save()
        restaurant1 = Restaurant(yelp_id="1234", json='{"name": "Miku"}')
        restaurant2 = Restaurant(yelp_id="1235", json='{"name": "Sushi California"}')
        restaurant1.save()
        restaurant2.save()
        tournament1 = Tournament(event=event, restaurant=restaurant1, vote_count=1)
        tournament2 = Tournament(event=event, restaurant=restaurant2, vote_count=0)
        tournament1.save()
        tournament2.save()
        tournament1.competitor = tournament2
        tournament2.competitor = tournament1
        tournament1.save()
        tournament2.save()

        data = {"is_finished": True, "tournament_data": [[{'id': tournament1.id}, {'id': tournament2.id}]],
                "tournaments": [tournament1.id]}
        response = self.request_helper_put(user, event, True, data=data)
        tournament_result = Tournament.objects.get(pk=tournament1.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['Next'], 1)
        self.assertEqual(tournament_result.vote_count, 0)

    def test_next_round_success_t2(self):
        """Ensure we move to next round successfully"""
        user, event = self.generate_tournament_helper(round_num=1)
        attach = EventUserAttach(event=event, user=user)
        attach.save()
        restaurant1 = Restaurant(yelp_id="1234", json='{"name": "Miku"}')
        restaurant2 = Restaurant(yelp_id="1235", json='{"name": "Sushi California"}')
        restaurant1.save()
        restaurant2.save()
        tournament1 = Tournament(event=event, restaurant=restaurant1, vote_count=0)
        tournament2 = Tournament(event=event, restaurant=restaurant2, vote_count=0)
        tournament1.save()
        tournament2.save()
        tournament1.competitor = tournament2
        tournament2.competitor = tournament1
        tournament1.save()
        tournament2.save()

        data = {"is_finished": True, "tournament_data": [[{'id': tournament1.id}, {'id': tournament2.id}]],
                "tournaments": [tournament2.id]}
        response = self.request_helper_put(user, event, True, data=data)
        tournament_result = Tournament.objects.get(pk=tournament2.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['Next'], 1)
        self.assertEqual(tournament_result.vote_count, 0)


class TestEventUser(APITestCase):
    def generate_data(self):
        user = User(username='testuser')
        user.save()
        pref = Preference(radius=2, latitude=10, longitude=10)
        pref.save()
        restaurant = Restaurant(yelp_id="12342")
        restaurant.save()
        event_detail = EventDetail(preference=pref,
                                   datetime=timezone.now(),
                                   name="My event details",
                                   description="Cool event",
                                   invite_code="8UF1H02P",
                                   restaurant=restaurant)
        event_detail.save()
        swipe = Swipe(user=user, yelp_id=restaurant.yelp_id)
        swipe.save()
        event = Event(creator=user, event_detail=event_detail, round_num=0)
        event.save()
        user_attach = EventUserAttach(event=event, user=user)
        user_attach.save()
        return user, event, user_attach

    def request_helper(self, user, event, authenticate, data):
        factory = APIRequestFactory()
        url = 'v1/users/{user_id}/events/{event_id}/rate'.format(user_id=str(user.id), event_id=str(event.id))
        request = factory.put(url, data, format='json')

        if authenticate:
            force_authenticate(request, user)
        view = views.EventUserAttachView.as_view()
        response = view(request, user_id=user.id, event_id=event.id)
        return response

    def test_add_rating_success(self):
        user, event, user_attach = self.generate_data()
        response = self.request_helper(user, event, True, data={'rating': 5})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['rating'], 5)

    def test_add_rating_invalid_event(self):
        user = User(username='testuser')
        user.save()
        pref = Preference(radius=2, latitude=10, longitude=10)
        pref.save()
        event_detail = EventDetail(preference=pref,
                                   datetime=timezone.now(),
                                   name="My event details",
                                   description="Cool event",
                                   invite_code="8UF1H02P")
        event_detail.save()
        event = Event(creator=user, event_detail=event_detail, round_num=0)
        response = self.request_helper(user, event, True, data={'rating': 5})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_add_rating_invalid_user(self):
        user, event, user_attach = self.generate_data()
        user1 = User(username="test223")
        response = self.request_helper(user1, event, True, data={'rating': 5})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_add_rating_invalid_user_attach(self):
        user = User(username='testuser')
        user.save()
        pref = Preference(radius=2, latitude=10, longitude=10)
        pref.save()
        event_detail = EventDetail(preference=pref,
                                   datetime=timezone.now(),
                                   name="My event details",
                                   description="Cool event",
                                   invite_code="8UF1H02P")
        event_detail.save()
        event = Event(creator=user, event_detail=event_detail, round_num=0)
        event.save()
        response = self.request_helper(user, event, True, data={'rating': 5})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
