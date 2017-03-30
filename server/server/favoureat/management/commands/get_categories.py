import urllib, json

from django.core.management.base import BaseCommand
from server.models import Cuisine

class Command(BaseCommand):
    """
    A command to handle population of cuisines table.
    """

    def handle(self, *args, **options):
        """
        Populates cuisines table with yelp categories data.
        """
        url = "https://www.yelp.ca/developers/documentation/v3/all_category_list/categories.json"
        response = urllib.urlopen(url)
        data = json.loads(response.read())
        for category in data:
            for_restaurants = "restaurants" in category.get("parents")
            whitelist = category.get("country_whitelist")
            blacklist = category.get("country_blacklist")
            whitelisted = whitelist == None or "CA" in whitelist
            not_blacklisted = blacklist == None or "CA" not in blacklist
            if for_restaurants and whitelisted and not_blacklisted:
                cuisine, created = Cuisine.objects.get_or_create(
                    name=category.get("title"),
                    category=category.get("alias")
                )

        msg = 'Successfully populated Cuisine table!'
        self.stdout.write(self.style.SUCCESS(msg))
