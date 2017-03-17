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
        token_response.raise_for_status()
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
        search_response.raise_for_status()
        return search_response.json()


    def get_details(self, access_token, business_id):
        """
        Gets restaurant details from the Yelp API.
        """
        headers = {
            'Authorization': 'Bearer {0}'.format(access_token)
        }
        url = '{0}{1}'.format(self.BASE_URL, self.BUSINESS_PATH.format(
            id=business_id.encode('utf-8')))
        business_response = requests.get(url, headers=headers)
        business_response.raise_for_status()
        return business_response.json()


    def get_reviews(self, access_token, business_id):
        """
        Gets restaurant reviews from the Yelp API.
        """
        headers = {
            'Authorization': 'Bearer {0}'.format(access_token)
        }
        url = '{0}{1}'.format(self.BASE_URL, self.REVIEWS_PATH.format(
            id=business_id.encode('utf-8')))
        reviews_response = requests.get(url, headers=headers)
        reviews_response.raise_for_status()
        return reviews_response.json().get('reviews')


    def get_and_save_restaurants(self, params, limit):
        """
        Retrieves restaurants from the Yelp API based
        on the passed parameters and caches the restaurants.
        """
        print 'Fetching...'
        restaurants = []
        try:
            # Get the token
            access_token = self.get_token()
            # Fetch from the Search API
            search_results = self.get_restaurants(access_token, params)

            for i, restaurant in enumerate(search_results.get('businesses', [])):
                print restaurant['name']
                yelp_id = restaurant['id']

                try:
                    # Fetch from the Reviews API
                    reviews = self.get_reviews(access_token, yelp_id)
                    restaurant['reviews'] = reviews

                    # Fetch from the Business API
                    details = self.get_details(access_token, yelp_id)
                    restaurant['photos'] = details.get('photos', [])
                    restaurant['hours'] = details.get('hours', [])

                    saved_restaurant, created = Restaurant.objects.update_or_create(
                        yelp_id=yelp_id,
                        defaults={'json': json.dumps(restaurant)}
                    )

                    restaurants.append(saved_restaurant)
                    if len(restaurants) >= limit:
                        break
                except requests.exceptions.HTTPError as err:
                    # Acceptable if cannot retrieve details or reviews
                    print err
                    continue
        except requests.exceptions.HTTPError as err:
            print err

        print 'Done'
        return restaurants
