from django.db import models


class User(models.Model):
    fb_id = models.CharField(max_length=200, null=False)


class Preference(models.Model):
    min_price = models.DecimalField(null=True, decimal_places=2, max_digits=5)
    max_price = models.DecimalField(null=True, decimal_places=2, max_digits=5)
    radius = models.IntegerField(null=False)


class Cuisine(models.Model):
    type = models.CharField(max_length=200, null=False)


class EventDetail(models.Model):
    yelp_id = models.IntegerField(null=True)
    preference = models.ForeignKey(Preference)
    datetime = models.DateTimeField(null=False)
    name = models.CharField(max_length=200, null=False)
    description = models.TextField(null=True)
    invite_code = models.CharField(max_length=200, null=True)
    voting_deadline = models.DateField(null=True)


class Event(models.Model):
    user = models.ForeignKey(User)
    event_detail = models.ForeignKey(EventDetail)
    round_num = models.IntegerField(default=0)


class PreferenceCuisine(models.Model):
    preference = models.ForeignKey(Preference)
    cuisine = models.ForeignKey(Cuisine)


class Swipe(models.Model):
    user = models.ForeignKey(User)
    yelp_id = models.IntegerField(null=False)
    right_swipe_count = models.IntegerField(default=0)
    left_swipe_count = models.IntegerField(default=0)


class Restaurant(models.Model):
    yelp_id = models.IntegerField(null=False)
    json = models.TextField(null=True)


class Tournament(models.Model):
    event = models.ForeignKey(Event)
    restaurant = models.ForeignKey(Restaurant)
    vote_count = models.IntegerField(default=0)
