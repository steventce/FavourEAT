from recommends.tasks import recommends_precompute

from django.core.management.base import BaseCommand

class Command(BaseCommand):
    """
    A command to do computations for the restaurant suggestions.
    """

    def handle(self, *args, **options):
        recommends_precompute()

        msg = 'Successfully precomputed Restaurant suggestions!'
        self.stdout.write(self.style.SUCCESS(msg))
