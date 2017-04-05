from __future__ import absolute_import
from celery import shared_task
import json
from django.utils import timezone
from server.models import Tournament, Event
from server.favoureat.fcm_service import FcmService
from datetime import timedelta


@shared_task
def test(param):
    return 'The test task executed with argument "%s" ' % param


@shared_task
def update_next_round(event_id):
    e = Event.objects.filter(pk=event_id)
    if e.count() == 0:
        return False
    event = e[0]

    if timezone.now() < event.round_start + timedelta(hours=event.round_duration):
        return False

    event.round_num += 1
    event.round_start = timezone.now()
    event.save()
    # Schedule a job to be run later for next round
    # update_next_round.apply_async(args=[event_id], countdown=event.round_duration * 3600)

    num_remaining = 0
    winner = None
    tournaments = Tournament.objects.filter(event=event)
    # Update restaurants for next tournament round
    if event.round_num == 1:
        for t in tournaments:
            tournament = Tournament.objects.get(pk=t.id)
            if tournament.vote_count > 0:
                tournament.vote_count = 0
                num_remaining += 1
                tournament.save()
                winner = tournament.restaurant
            else:
                tournament.delete()
    else:
        computed = []
        to_delete = []
        for t in tournaments:
            tournament1 = t
            tournament2 = t.competitor if t is not None else None

            if tournament2 is None or tournament1.id in computed or tournament2.id in computed:
                continue
            elif tournament1.vote_count == tournament2.vote_count:
                tournament1.vote_count = 0
                tournament1.competitor = None
                tournament1.save()
                tournament2.vote_count = 0
                tournament2.competitor = None
                tournament2.save()
                num_remaining += 2
            elif tournament1.vote_count > tournament2.vote_count:
                tournament1.vote_count = 0
                tournament1.competitor = None
                tournament1.save()
                num_remaining += 1
                winner = tournament1.restaurant
                to_delete.append(tournament2)
            else:
                tournament2.vote_count = 0
                tournament2.competitor = None
                tournament2.save()
                num_remaining += 1
                winner = tournament2.restaurant
                to_delete.append(tournament1)
            computed.append(tournament2.id)
            computed.append(tournament1.id)

        for t in to_delete:
            t.delete()

    # If only 1 restaurant left, then update event details with the winner.
    if num_remaining == 1:
        event_details = event.event_detail
        event_details.restaurant = winner
        event_details.save()

        # Notify participants of update
        if event.is_group:
            fcm_service = FcmService()
            title = '{name} updated'.format(name=event_details.name)
            restaurant_data = json.loads(event_details.restaurant.json)
            winner_str = restaurant_data['name']
            body = '{first_name} updated the winning restaurant to {name}'.format(
                first_name=event.creator.first_name, name=winner_str)

            fcm_service.notify_all_participants(event.id, title, body)

    return True

