from django.contrib.auth.models import User
from recommends.providers import RecommendationProvider
from recommends.providers import recommendation_registry
import math

from server.models import Restaurant, Swipe

class RestaurantRecommendationProvider(RecommendationProvider):
    def get_users(self):
        return User.objects.filter(is_active=True, swipe__isnull=False).distinct()

    def get_items(self):
        return Restaurant.objects.all()

    def get_ratings(self, obj):
        return Swipe.objects.filter(yelp_id=obj.yelp_id)

    def get_rating_score(self, rating):
        total_swipes = rating.right_swipe_count + rating.left_swipe_count

        right_swipe_ratio = (float(rating.right_swipe_count) / float(total_swipes)) * 5.0
        left_swipe_ratio = (float(rating.left_swipe_count) / float(total_swipes)) * 5.0

        avg_rating = rating.avg_rating
        # use a middle rating to avoid poor suggestions when users don't vote
        if avg_rating == 0:
            avg_rating = 3

        # create a score that is weighted average of right swipes, left swipes and rating
        return min(max(0, 0.5 * right_swipe_ratio + 0.7 * avg_rating - 0.2 * left_swipe_ratio), 5)  

    def get_rating_user(self, rating):
        return rating.user

    def get_rating_item(self, rating):
        return Restaurant.objects.get(rating.yelp_id)

recommendation_registry.register(Swipe, [Restaurant], RestaurantRecommendationProvider)