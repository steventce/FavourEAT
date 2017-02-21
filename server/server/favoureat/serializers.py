__author__ = 'ncboodah'

from rest_framework import serializers
from server.models import Swipe


class SwipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Swipe
        fields = ('id', 'user', 'yelp_id', 'right_swipe_count', 'left_swipe_count')
