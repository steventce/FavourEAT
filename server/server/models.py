from django.db import models
from django.contrib.auth.models import User


class Preference(models.Model):
    min_price = models.DecimalField(null=True, blank=True, decimal_places=2, max_digits=5)
    max_price = models.DecimalField(null=True, blank=True, decimal_places=2, max_digits=5)
    radius = models.IntegerField(null=False)
    latitude = models.DecimalField(null=False, decimal_places=6, max_digits=8)
    longitude = models.DecimalField(null=False, decimal_places=6, max_digits=9)


class Cuisine(models.Model):
    name = models.CharField(max_length=200, null=False)
    category = models.CharField(max_length=200, null=False)


class EventDetail(models.Model):
    yelp_id = models.CharField(max_length=200, null=True, blank=True)
    preference = models.ForeignKey(Preference)
    datetime = models.DateTimeField(null=False)
    name = models.CharField(max_length=200, null=False)
    description = models.TextField(null=True, blank=True)
    invite_code = models.CharField(max_length=200, null=True, blank=True)
    voting_deadline = models.DateTimeField(null=True, blank=True)


class Event(models.Model):
    creator = models.ForeignKey(User)
    event_detail = models.ForeignKey(EventDetail)
    round_num = models.IntegerField(default=0)


class EventUserAttach(models.Model):
    user = models.ForeignKey(User)
    event = models.ForeignKey(Event)


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


class Tournament(models.Model):
    event = models.ForeignKey(Event)
    restaurant = models.ForeignKey(Restaurant)
    vote_count = models.IntegerField(default=0)
