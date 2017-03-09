from server.favoureat.yelp_api_service import YelpAPIService
from server.models import Swipe

class RecommendationService(object):
    """
    Provides restaurant recommendations to users.
    """
    QUERY_LIMIT = 19 # counts from 0

    def get_restaurants(self, user_id, preference):
        """
        Gets recommended restaurants. If there is previous swipe data
        available, use it to make a recommendation. Otherwise, query
        the Yelp API.
        """
        # Avoid sending additional API requests for unused restaurants

        user_swipes = Swipe.objects.filter(pk=user_id)

        if not user_swipes.exists():
            print 'User doesnt exist... call the Yelp API Service'
            return YelpAPIService().get_and_save_restaurants(preference, self.QUERY_LIMIT)

        # Make recommendation
