from server.favoureat.yelp_api_service import YelpAPIService

from django.core.management.base import BaseCommand
from server.models import Cuisine

class Command(BaseCommand):
    """
    A command to prefetch restaurants data and cache it. Should be used with clear_restaurants_cache.
    """

    def handle(self, *args, **options):
        """
        Populates restaurants table.
        """
        YELP_LIMIT = 50
        YELP_OVERALL_LIMIT = 500
        # latitude and longitude is an arbitrary center where to start searching
        preference = {
            'term': 'restaurants',
            'latitude': 49.222036, 
            'longitude': -123.044693,
            'limit': YELP_LIMIT,
            'sort_by': 'rating'
        }

        for i in range(0, YELP_OVERALL_LIMIT/YELP_LIMIT):
            preference['offset'] = i*YELP_LIMIT
            YelpAPIService().get_and_save_restaurants(preference, YELP_OVERALL_LIMIT)

        msg = 'Successfully got Restaurants data!'
        self.stdout.write(self.style.SUCCESS(msg))
