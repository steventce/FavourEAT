import json
import requests

from django.conf import settings
from server.models import Restaurant

class YelpAPIService(object):
    """
    A service class for accessing the Yelp API.
    Adapted from: https://github.com/Yelp/yelp-fusion/blob/master/fusion/python/sample.py
    """
    BASE_URL = 'https://api.yelp.com'
    TOKEN_PATH = '/oauth2/token'
    SEARCH_PATH = '/v3/businesses/search'
    REVIEWS_PATH = '/v3/businesses/{id}/reviews'
    BUSINESS_PATH = '/v3/businesses/{id}'

    def get_token(self):
        """
        Gets an OAuth2 token from the Yelp API.
        """
        data = {
            'grant_type': 'client_credentials',
            'client_id': settings.YELP_APP_ID,
            'client_secret': settings.YELP_APP_SECRET
        }
        token_response = requests.post('{0}{1}'.format(self.BASE_URL, self.TOKEN_PATH), data=data)
        return token_response.json().get('access_token')


    def get_restaurants(self, access_token, params):
        """
        Gets restaurants from the Yelp API.
        """
        print 'Get restaurants'
        headers = {
            'Authorization': 'Bearer {0}'.format(access_token)
        }

        search_response = requests.get('{0}{1}'.format(self.BASE_URL, self.SEARCH_PATH) \
            , params=params, headers=headers)
        return search_response.json()


    def get_details(self, access_token, business_id):
        """
        Gets restaurant details from the Yelp API.
        """
        print 'Get details'
        headers = {
            'Authorization': 'Bearer {0}'.format(access_token)
        }
        url = '{0}{1}'.format(self.BASE_URL, self.BUSINESS_PATH.format(
            id=business_id.encode('utf-8')))
        business_response = requests.get(url, headers=headers)
        return business_response.json()


    def get_reviews(self, access_token, business_id):
        """
        Gets restaurant reviews from the Yelp API.
        """
        print 'Get reviews'
        headers = {
            'Authorization': 'Bearer {0}'.format(access_token)
        }
        url = '{0}{1}'.format(self.BASE_URL, self.REVIEWS_PATH.format(
            id=business_id.encode('utf-8')))
        reviews_response = requests.get(url, headers=headers)
        return reviews_response.json().get('reviews')


    def get_and_save_restaurants(self, params, limit):
        """
        Retrieves restaurants from the Yelp API based
        on the passed parameters and caches the restaurants.
        """
        print 'Fetching...'
        # Get the token
        access_token = self.get_token()
        # Fetch from the Search API
        search_results = self.get_restaurants(access_token, params)
        restaurants = []

        for i, restaurant in enumerate(search_results.get('businesses', [])):
            yelp_id = restaurant['id']

            # Fetch from the Reviews API
            reviews = self.get_reviews(access_token, yelp_id)
            restaurant['reviews'] = reviews

            # Fetch from the Business API
            details = self.get_details(access_token, yelp_id)
            if 'photos' in restaurant:
                restaurant['photos'] = details.get('photos', [])
            if 'hours' in restaurant:
                restaurant['hours'] = details.get('hours', [])

            saved_restaurant, created = Restaurant.objects.update_or_create(
                yelp_id=yelp_id,
                defaults={'json': json.dumps(restaurant)}
            )

            restaurants.append(saved_restaurant)
            if i >= limit:
                break

        print 'Done'
        return restaurants
