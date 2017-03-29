import requests

from mock import patch, Mock
from django.test import TestCase
from server.models import Restaurant
from server.favoureat import yelp_api_service

class YelpApiTests(TestCase):
    """ A class for testing the Yelp API Service """
    MAX_RESTAURANTS = 5
    yelp_service_path = 'server.favoureat.yelp_api_service.YelpAPIService.{method}'

    @patch(yelp_service_path.format(method='get_reviews'))
    @patch(yelp_service_path.format(method='get_details'))
    @patch(yelp_service_path.format(method='get_restaurants'))
    @patch(yelp_service_path.format(method='get_token'))
    def test_restaurants_no_businesses(self,
                                       get_token_mock,
                                       get_restaurants_mock,
                                       get_details_mock,
                                       get_reviews_mock):
        """ Ensure no error is thrown with no businesses returned """
        get_token_mock.return_value = 'ABC'
        get_restaurants_mock.return_value = {'businesses': []}
        get_details_mock.return_value = {}
        get_reviews_mock.return_value = {}

        service = yelp_api_service.YelpAPIService()
        restaurants = service.get_and_save_restaurants({}, self.MAX_RESTAURANTS)
        self.assertEqual(len(restaurants), 0)
        self.assertEqual(Restaurant.objects.count(), 0)

    @patch(yelp_service_path.format(method='get_reviews'))
    @patch(yelp_service_path.format(method='get_details'))
    @patch(yelp_service_path.format(method='get_restaurants'))
    @patch(yelp_service_path.format(method='get_token'))
    def test_restaurant_limit(self,
                              get_token_mock,
                              get_restaurants_mock,
                              get_details_mock,
                              get_reviews_mock):
        """ Ensure that the limit is used when returning restaurants """
        default_restaurants = [{
            'name': 'Sandy Diner',
            'id': x,
            'image_url': 'http://...'
        } for x in xrange(self.MAX_RESTAURANTS + 1)]
        get_token_mock.return_value = 'ABC'
        get_restaurants_mock.return_value = {'businesses': default_restaurants}
        get_details_mock.return_value = {}
        get_reviews_mock.return_value = {}

        service = yelp_api_service.YelpAPIService()
        restaurants = service.get_and_save_restaurants({}, self.MAX_RESTAURANTS)
        self.assertEqual(len(restaurants), self.MAX_RESTAURANTS)
        self.assertEqual(Restaurant.objects.count(), self.MAX_RESTAURANTS)

    @patch(yelp_service_path.format(method='get_reviews'))
    @patch(yelp_service_path.format(method='get_details'))
    @patch(yelp_service_path.format(method='get_restaurants'))
    @patch(yelp_service_path.format(method='get_token'))
    def test_restaurant_with_no_image(self,
                                      get_token_mock,
                                      get_restaurants_mock,
                                      get_details_mock,
                                      get_reviews_mock):
        """ Ensure that the limit is used when returning restaurants """
        default_restaurants = [{
            'name': 'Sandy Diner',
            'id': x,
            'image_url': ''
        } for x in xrange(self.MAX_RESTAURANTS)]
        get_token_mock.return_value = 'ABC'
        get_restaurants_mock.return_value = {'businesses': default_restaurants}
        get_details_mock.return_value = {}
        get_reviews_mock.return_value = {}

        service = yelp_api_service.YelpAPIService()
        restaurants = service.get_and_save_restaurants({}, self.MAX_RESTAURANTS)
        self.assertEqual(len(restaurants), 0)
        self.assertEqual(Restaurant.objects.count(), 0)

    @patch(yelp_service_path.format(method='get_reviews'))
    @patch(yelp_service_path.format(method='get_details'))
    @patch(yelp_service_path.format(method='get_restaurants'))
    @patch(yelp_service_path.format(method='get_token'))
    def test_yelp_http_error(self,
                             get_token_mock,
                             get_restaurants_mock,
                             get_details_mock,
                             get_reviews_mock):
        """ Ensure that an bad HTTP response from Yelp is caught """
        default_restaurants = [{
            'name': 'Sandy Diner',
            'id': x,
            'image_url': 'http://...'
        } for x in xrange(self.MAX_RESTAURANTS)]
        get_token_mock.return_value = 'ABC'
        get_token_mock.side_effect = requests.exceptions.HTTPError(
            Mock(status=503), 'Service Unavailable')
        get_restaurants_mock.return_value = {'businesses': default_restaurants}
        get_details_mock.return_value = {}
        get_reviews_mock.return_value = {}

        service = yelp_api_service.YelpAPIService()

        restaurants = service.get_and_save_restaurants({}, self.MAX_RESTAURANTS)
        self.assertEqual(len(restaurants), 0)
        self.assertEqual(Restaurant.objects.count(), 0)

        # Restaurants
        get_token_mock.side_effect = None
        get_restaurants_mock.side_effect = requests.exceptions.HTTPError(
            Mock(status=400), 'Bad Request')

        restaurants = service.get_and_save_restaurants({}, self.MAX_RESTAURANTS)
        self.assertEqual(len(restaurants), 0)
        self.assertEqual(Restaurant.objects.count(), 0)

        # Details
        get_restaurants_mock.side_effect = None
        get_details_mock.side_effect = requests.exceptions.HTTPError(
            Mock(status=500), 'Internal Server Error')

        restaurants = service.get_and_save_restaurants({}, self.MAX_RESTAURANTS)
        self.assertEqual(len(restaurants), 0)
        self.assertEqual(Restaurant.objects.count(), 0)

        # Reviews
        get_details_mock.side_effect = None
        get_reviews_mock.side_effect = requests.exceptions.HTTPError(
            Mock(status=503), 'Service unavailable')

        restaurants = service.get_and_save_restaurants({}, self.MAX_RESTAURANTS)
        self.assertEqual(len(restaurants), 0)
        self.assertEqual(Restaurant.objects.count(), 0)
