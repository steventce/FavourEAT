__author__ = 'ncboodah'

from django.contrib.auth.models import User
from rest_framework import serializers
from server.models import Swipe

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name')

class SwipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Swipe
        fields = ('id', 'user', 'yelp_id', 'right_swipe_count', 'left_swipe_count')
