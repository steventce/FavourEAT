from django.conf import settings
from server.models import Restaurant
from server.favoureat.serializers import RestaurantSerializer

import requests
import json

class YelpAPIService:
    """
    Authorizes against the Yelp API server and caches the response.
    Currently for testing purposes only.
    """
    @staticmethod
    def get_and_save_restaurants():
        if Restaurant.objects.all().count() > 0:
            return

        print('Fetching...')

        base_url     = 'https://api.yelp.com'
        token_url    = '/oauth2/token'
        search_url   = '/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972'
        reviews_url  = '/v3/businesses/{id}/reviews'
        business_url = '/v3/businesses/{id}'

        data = {
            'grant_type': 'client_credentials',
            'client_id': settings.YELP_APP_ID,
            'client_secret': settings.YELP_APP_SECRET
        }

        headers = {
            'content-type': 'application/x-www-form-urlencoded',
        }

        token_response = requests.post('{0}{1}'.format(base_url, token_url), data=data)
        access_token = token_response.json()['access_token']

        # Fetch from the Search API
        headers = {
            'Authorization': 'Bearer {0}'.format(access_token)
        }

        search_response = requests.get('{0}{1}'.format(base_url, search_url), headers=headers)

        for restaurant in search_response.json()['businesses']:
            # Fetch from the Reviews API
            url = '{0}{1}'.format(base_url, reviews_url.format(id=restaurant['id']))

            reviews_response = requests.get(url, headers=headers)
            restaurant['reviews'] = reviews_response.json()['reviews']

            # Fetch from the Business API
            url = '{0}{1}'.format(base_url, business_url.format(id=restaurant['id']))
            business_response = requests.get(url, headers=headers)
            restaurant['photos'] = business_response.json()['photos']
            restaurant['hours'] = business_response.json()['hours']

            Restaurant.objects.update_or_create(
                yelp_id=restaurant['id'],
                defaults={ 'json': json.dumps(restaurant) }
            )

        print('Done')
