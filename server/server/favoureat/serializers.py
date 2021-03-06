__author__ = 'ncboodah'

from django.contrib.auth.models import User
from rest_framework import serializers
from server.models import (
    Swipe,
    Restaurant,
    Tournament,
    EventDetail,
    Event,
    EventUserAttach,
    Preference
)

import json

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name')


class SwipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Swipe
        fields = ('id', 'user', 'yelp_id', 'right_swipe_count', 'left_swipe_count')


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ('id', 'yelp_id', 'json')

    def to_representation(self, instance):
        restaurant = super(RestaurantSerializer, self).to_representation(instance)
        rid = restaurant['id']
        data = restaurant.pop('json')
        json_data = json.loads(data)
        restaurant.update(json_data)
        restaurant.update(id=rid)

        return restaurant


class EventDetailSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer()

    class Meta:
        model = EventDetail
        fields = ('id', 'restaurant', 'preference',
                  'datetime', 'name', 'description', 'invite_code')


class EventSerializer(serializers.ModelSerializer):
    event_detail = EventDetailSerializer()
    creator = UserSerializer()

    class Meta:
        model = Event
        fields = ('id', 'creator', 'event_detail', 'round_num', 'round_duration', 'round_start', 'is_group')


class TournamentSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer()
    event = EventSerializer()

    class Meta:
        model = Tournament
        fields = ('id', 'restaurant', 'event', 'vote_count')


class EventUserAttachSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = EventUserAttach
        fields = ('id', 'user')


class PreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preference
        fields = ('id', 'min_price', 'max_price', 'radius', 'latitude', 'longitude', 'latitude')
