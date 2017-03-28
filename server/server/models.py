from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

class UserFcm(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    fcm_token = models.CharField(max_length=200, null=True, blank=True)


class Preference(models.Model):
    min_price = models.DecimalField(null=True, blank=True, decimal_places=2, max_digits=5)
    max_price = models.DecimalField(null=True, blank=True, decimal_places=2, max_digits=5)
    radius = models.IntegerField(null=False)
    latitude = models.DecimalField(null=False, decimal_places=6, max_digits=8)
    longitude = models.DecimalField(null=False, decimal_places=6, max_digits=9)


class Cuisine(models.Model):
    name = models.CharField(max_length=200, null=False)
    category = models.CharField(max_length=200, null=False)


class PreferenceCuisine(models.Model):
    preference = models.ForeignKey(Preference)
    cuisine = models.ForeignKey(Cuisine)


class Swipe(models.Model):
    user = models.ForeignKey(User)
    yelp_id = models.CharField(max_length=200, null=False)
    right_swipe_count = models.IntegerField(default=0)
    left_swipe_count = models.IntegerField(default=0)


class Restaurant(models.Model):
    yelp_id = models.CharField(max_length=200, null=False)
    json = models.TextField(null=True, blank=True)


class EventDetail(models.Model):
    restaurant = models.ForeignKey(Restaurant, null=True, blank=True)
    preference = models.ForeignKey(Preference)
    datetime = models.DateTimeField(null=False)
    name = models.CharField(max_length=200, null=False)
    description = models.TextField(null=True, blank=True)
    invite_code = models.CharField(max_length=200, null=True, blank=True)


class Event(models.Model):
    creator = models.ForeignKey(User)
    event_detail = models.ForeignKey(EventDetail)
    round_num = models.IntegerField(default=0)
    round_duration = models.IntegerField(default=0)
    round_start = models.DateTimeField(default=now)
    is_group = models.BooleanField(default=False)


class EventUserAttach(models.Model):
    user = models.ForeignKey(User)
    event = models.ForeignKey(Event)
    last_round_voted = models.IntegerField(default=-1)
    rating = models.IntegerField(default=0)


class Tournament(models.Model):
    event = models.ForeignKey(Event)
    restaurant = models.ForeignKey(Restaurant)
    vote_count = models.IntegerField(default=0)
