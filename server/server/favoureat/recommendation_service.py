from django.contrib.auth.models import User
from server.favoureat.yelp_api_service import YelpAPIService
from server.favoureat.geo_utils import GeoUtils
from recommends.providers import recommendation_registry
import copy
from itertools import chain
import random

from server.models import Swipe, Restaurant, Cuisine, EventUserAttach

class RecommendationService(object):
    """
    Provides restaurant recommendations to users.
    """
    QUERY_LIMIT = 20 # counts from 0
    RECOMMENDATION_LIMIT = QUERY_LIMIT / 2

    def get_restaurants(self, user_id, preference):
        """
        Gets recommended restaurants. If there is previous swipe data
        available, use it to make a recommendation. 
        """
        self.recommender = recommendation_registry.get_provider_for_content(Restaurant)

        # retrieve restaurants filtered by preference
        current_lat = preference.get('latitude')
        current_lon = preference.get('longitude')
        radius = preference.get('radius')
        price = preference.get('price')
        cuisine_types = preference.get('categories').split(',')
        min_coords, max_coords = GeoUtils().get_bounding_box((current_lat, current_lon), radius)

        min_lat, min_lon = min_coords
        max_lat, max_lon = max_coords

        cuisines = Cuisine.objects.filter(
            category__in=cuisine_types
        ).values_list('pk', flat=True)

        current_user = User.objects.get(pk=user_id)
        recommendations = self.recommender.storage.get_recommendations_for_user(current_user).values_list('object_id', flat=True)
        # TODO: have to do a more complicated query to get restaurants within a circular radius rather than a bounding box
        restaurants = []
        kwargs = {
            'latitude__range': (min_lat, max_lat),
            'longitude__range': (min_lon, max_lon),
            'price': price
        }

        if len(cuisines) > 0:
            kwargs['cuisines__in'] = list(cuisines)

        # retrieve recommended restaurants that fit preferences
        rec_kwargs = copy.copy(kwargs)
        rec_kwargs['pk__in'] = list(recommendations)
        recommended_restaurants = Restaurant.objects.filter(**rec_kwargs)[:self.RECOMMENDATION_LIMIT]

        print "recommended restaurants", len(recommended_restaurants)
        for r in recommended_restaurants:
            print r.yelp_id
        recommended_restaurants_ids = recommended_restaurants.values_list('yelp_id', flat=True)

        # if number of recommendations isn't enough, get more restaurants
        num_other = self.QUERY_LIMIT - len(recommended_restaurants)
        other_restaurants = Restaurant.objects.filter(**kwargs).exclude(
            yelp_id__in=recommended_restaurants_ids
        ).order_by('?')[:num_other]
        restaurants = list(chain(recommended_restaurants, other_restaurants))

        # randomize order to prevent list from looking always the same
        random.shuffle(restaurants)

        return restaurants
