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
    Preference
)
from django.contrib.auth.models import User
from server.favoureat import views

class UserTests(APITestCase):
    def test_success_get_user(self):
        """ Ensure that a user can be retrieved """
        user_id = 2
        name = 'bob'
        user = User.objects.create(username=name)
        self.assertEqual(User.objects.count(), 1)

        url = ''.join(['/v1/users', '/', str(user_id)])
        factory = APIRequestFactory()
        request = factory.get(url)
        force_authenticate(request, user=user)

        view = views.UserView.as_view()
        response = view(request, user_id=user.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected = {'first_name': '', 'last_name': '', 'id': user_id}
        self.assertEqual(response.data, expected)

    def test_error_no_token(self):
        """ Ensure that the endpoint requires an access token """
        user_id = 2
        User.objects.create(username='bob')
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

class UserSwipeTests(APITestCase):
    def test_save_swipe(self):
        """ Ensure we can save a user swipe decision """
        user = User.objects.create(pk='139530')
        user.save()

        data = {'user': user.id,
                'yelp_id': 'yelp_business',
                'right_swipe_count': 1,
                'left_swipe_count': 0}
        url = '/v1/users/' + str(data['user']) + '/swipes/'

        factory = APIRequestFactory()
        request = factory.post(url, data, format='json')
        force_authenticate(request, user=user)
        view = views.UserSwipeView.as_view()
        response = view(request, user=user.id)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Swipe.objects.count(), 1)
        self.assertEqual(Swipe.objects.get().yelp_id, data['yelp_id'])
        self.assertEqual(Swipe.objects.get().right_swipe_count, data['right_swipe_count'])
        self.assertEqual(Swipe.objects.get().left_swipe_count, data['left_swipe_count'])

    def test_error_save_swipe(self):
        """ Ensure that error occurs if we try to save a swipe decision with nonexisting user """
        user = User.objects.create(pk='139530')
        user.save()

        data = {'user': 16,
                'yelp_id': 54623,
                'right_swipe_count': 9,
                'left_swipe_count': 0}
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

        data = {'user': user.id,
                'yelp_id': 54623,
                'right_swipe_count': 'hello',
                'left_swipe_count': 'goodbye'}
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
        'max_price': 50, 'name': 'Test'
    }

    def event_helper(self, user_id, data, authenticate, method='GET'):
        """ Helper to post to the create event endpoint """
        user = User(pk=user_id)
        user.save()

        url = 'v1/users/{user_id}/events'.format(user_id=str(user_id))
        factory = APIRequestFactory()
        request = factory.post(url, data, format='json') if method == 'POST' else factory.get(url)

        if authenticate:
            force_authenticate(request, user)
        view = views.EventView.as_view()
        response = view(request, user_id=user_id)
        return response

    def test_get_user_events(self):
        """ Ensures that a user can successfully retrieve their events """
        expected_len = 5
        user = User(pk=10)
        user.save()
        for index in xrange(expected_len):
            preference = Preference(radius=1, latitude=2, longitude=3)
            preference.save()

            event_detail = EventDetail(
                datetime=timezone.now(),
                name='My Event Detail {index}'.format(index=index),
                preference=preference
            )
            event_detail.save()

            event = Event(creator=user, event_detail=event_detail, round_num=0)
            event.save()
            user.eventuserattach_set.create(event=event, user=user)

        response = self.event_helper(10, None, True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), expected_len)

    def test_event_save_no_token(self):
        """ Ensure that an unauthorized error occurs with no authentication """
        response = self.event_helper(10, None, False, 'POST')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_event_save_no_params(self):
        """ Ensure that a 400 response is returned when there are no params """
        response = self.event_helper(10, {}, True, 'POST')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('server.favoureat.recommendation_service.RecommendationService.get_restaurants')
    def test_event_save_pref(self, get_restaurants_mock):
        """ Ensure that preferences are saved correctly when creating an event """
        user_id = 10
        # Mock out the Yelp API call
        get_restaurants_mock.return_value = []

        response = self.event_helper(user_id, self.data, True, 'POST')
        event = Event.objects.get(creator=user_id)
        self.assertEqual(event.event_detail.name, self.data['name'])

        preference = event.event_detail.preference

        self.assertEqual(preference.radius, self.data['radius'])
        self.assertEqual(preference.latitude, self.data['latitude'])
        self.assertEqual(preference.longitude, self.data['longitude'])
        self.assertEqual(preference.min_price, self.data['min_price'])
        self.assertEqual(preference.max_price, self.data['max_price'])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch('server.favoureat.recommendation_service.RecommendationService.get_restaurants')
    def test_event_save_detail(self, get_restaurants_mock):
        """ Ensure that event details are saved correctly when creating an event """
        user_id = 10
        # Mock out the Yelp API call
        get_restaurants_mock.return_value = []

        response = self.event_helper(user_id, self.data, True, 'POST')
        event = Event.objects.get(creator=user_id)
        self.assertEqual(event.event_detail.name, self.data['name'])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch('server.favoureat.recommendation_service.RecommendationService.get_restaurants')
    def test_event_save_attach(self, get_restaurants_mock):
        """ Ensure that event user attach is saved correctly when creating an event """
        user_id = 10
        # Mock out the Yelp API call
        get_restaurants_mock.return_value = []

        response = self.event_helper(user_id, self.data, True, 'POST')
        event = Event.objects.get(creator=user_id)
        self.assertEqual(event.eventuserattach_set.first().user_id, user_id)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch('server.favoureat.recommendation_service.RecommendationService.get_restaurants')
    def test_event_save_tournament(self, get_restaurants_mock):
        """ Ensure that tournaments are saved correctly when creating an event """
        user_id = 10
        restaurants = Restaurant.objects.bulk_create([
            Restaurant(yelp_id='Cheap Foods'),
            Restaurant(yelp_id='Some Pizza'),
            Restaurant(yelp_id='Good Rice')
        ])
        get_restaurants_mock.return_value = restaurants

        response = self.event_helper(user_id, self.data, True, 'POST')
        event = Event.objects.get(creator=user_id)
        self.assertEqual(len(event.tournament_set.values()), len(restaurants))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
