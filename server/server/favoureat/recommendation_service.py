from server.favoureat.yelp_api_service import YelpAPIService
from server.favoureat.geo_utils import GeoUtils
from server.models import Swipe, Restaurant, Cuisine

class RecommendationService(object):
    """
    Provides restaurant recommendations to users.
    """
    QUERY_LIMIT = 5 # counts from 0

    def get_restaurants(self, user_id, preference):
        """
        Gets recommended restaurants. If there is previous swipe data
        available, use it to make a recommendation. Otherwise, query
        the Yelp API.
        """
        # Avoid sending additional API requests for unused restaurants

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

        # TODO: have to do a more complicated query to get restaurants within a circular radius rather than a bounding box
        restaurants = Restaurant.objects.filter(
            latitude__range=(min_lat, max_lat),
            longitude__range=(min_lon, max_lon),
            price=price,
            cuisine__in=list(cuisines)
        )

        # print 'User doesnt exist... call the Yelp API Service'
        # restaurants = YelpAPIService().get_and_save_restaurants(preference, self.QUERY_LIMIT)

        # Make recommendation
        return restaurants
