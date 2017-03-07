import time

from django.core.management.base import BaseCommand
from server.models import Restaurant

class Command(BaseCommand):
    """
    A command to handle the removal of cached Yelp data.
    """

    def handle(self, *args, **options):
        """
        Removes Yelp data cached in the database according to their
        Terms of Reference. Yelp business ids do not get removed.
        """
        now = time.strftime('%Y-%m-%d %H:%M:%S')
        msg = '[{0}] Successfully cleared restaurant data cache'.format(str(now))

        Restaurant.objects.all().update(json=None)
        self.stdout.write(self.style.SUCCESS(msg))
