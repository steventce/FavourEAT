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
        # an arbitrary list of locations to determine where to search for restaurants
        locations = [
            (49.168809, -123.138644),   # Richmond Centre
            (49.263632, -123.245918),   # UBC
            (49.282735, -123.118441),   # Vancouver City Centre
            (49.240679, -123.112041),   # Queen Elizabeth Park
            (49.226161, -122.998964),   # Metrotown
            (49.277888, -122.918746),   # SFU
        ]

        YELP_LIMIT = 50
        YELP_OVERALL_LIMIT = 500

        for location in locations:
            preference = {
                'term': 'restaurants',
                'latitude': location[0], 
                'longitude': location[1],
                'radius': 40000,
                'limit': YELP_LIMIT,
            }

            for i in range(0, YELP_OVERALL_LIMIT/YELP_LIMIT):
                preference['offset'] = i*YELP_LIMIT
                YelpAPIService().get_and_save_restaurants(preference, YELP_OVERALL_LIMIT)

        msg = 'Successfully got Restaurants data!'
        self.stdout.write(self.style.SUCCESS(msg))
