from django.contrib.auth.models import User
from recommends.providers import RecommendationProvider
from recommends.providers import recommendation_registry

from server.models import Restaurant, Swipe

class RestaurantRecommendationProvider(RecommendationProvider):
    def get_users(self):
        return User.objects.filter(is_active=True, swipe__isnull=False).distinct()

    def get_items(self):
        return Restaurant.objects.all()

    def get_ratings(self, obj):
        return Swipe.objects.filter(yelp_id=obj.yelp_id)

    def get_rating_score(self, rating):
        return rating.avg_rating

    def get_rating_user(self, rating):
        return rating.user

    def get_rating_item(self, rating):
        return Restaurant.objects.get(rating.yelp_id)

recommendation_registry.register(Swipe, [Restaurant], RestaurantRecommendationProvider)