from django.conf import settings
from pyfcm import FCMNotification
from server.models import EventUserAttach

class FcmService(object):
    """
    A service that wraps around the pyfcm Firebase Cloud Messaging library.
    """
    DEFAULT_COLOR = '#ffb318'
    DEFAULT_ICON = 'ic_stat_name'
    DEFAULT_PRIORITY = 'high'
    DEFAULT_SOUND = 'default'
    DATETIME_FORMAT = '%-I:%M %p, %a, %b %d'

    def __init__(self):
        self.push_service = FCMNotification(api_key=settings.FCM_SERVER_KEY)

    def notify_all_participants(self, event_id, title, body, **options):
        """
        Notify all the participants in the event, including the creator.

        Args:
            event_id (int): The id of the event_id
            ...See args of method 'notify'

        Returns:
            dict: The result after notifying the devices
        """
        event_user_attaches = EventUserAttach.objects.filter(event=event_id)
        tokens = [a.user.userfcm.fcm_token for a in event_user_attaches if
                  hasattr(a.user, 'userfcm') and a.user.userfcm is not None]
        # If no tokens, return empty dict
        if len(tokens) == 0:
            return None
        return self.notify(tokens, title, body, **options)

    def notify_creator(self, user, title, body, **options):
        """
        Notify event creator.

        Args:
            user: The user object
            ...See args of method 'notify'

        Returns:
            dict: The result after notifying the devices
        """
        if hasattr(user, 'userfcm') and user.userfcm is not None:
            tokens = [user.userfcm.fcm_token]
            return self.notify(tokens, title, body, **options)
        return None

    def notify(self, fcm_tokens, title, body, **options):
        """
        Sends a single notification to the specified device. Default options
        configured for this app. Data message used to show notification when
        user has the app open.

        Refer to:
        https://github.com/evollu/react-native-fcm and
        https://firebase.google.com/docs/cloud-messaging/http-server-ref#notification-payload-support
        to learn about the parameters to pass to the front-end notification service.

        Args:
            fcm_tokens ([str]): A list of the FCM tokens to send to
            title (str): The title of the notification
            body (str): The body of the notification
            **options: Arbitrary keyword arguments for notification options

        Returns:
            dict: The result after notifying the devices
        """
        notification_options = {
            # Mandatory
            'title': title,
            'body': body,
            # Optional
            'auto_cancel': options.get('auto_cancel', True),
            'big_text': options.get('big_text', ''),
            'click_action': options.get('click_action', ''),
            'color': options.get('color', self.DEFAULT_COLOR),
            'icon': options.get('icon', self.DEFAULT_ICON),
            'large_icon': options.get('large_icon', ''),
            'lights': options.get('lights', True),
            'number': options.get('number', 1),
            'priority': options.get('priority', self.DEFAULT_PRIORITY),
            'show_in_foreground': options.get('show_in_foreground', True),
            'sound': options.get('sound', self.DEFAULT_SOUND),
            'sub_text': options.get('sub_text', None),
            'ticker': options.get('ticker', title),
            'tag': options.get('tag', ''),
            'group': options.get('group', '')
        }

        result = {}
        if len(fcm_tokens) == 1:
            result = self.push_service.notify_single_device(
                registration_id=fcm_tokens[0],
                data_message={
                    'custom_notification': notification_options
                }
            )
        else:
            result = self.push_service.notify_multiple_devices(
                registration_ids=fcm_tokens,
                data_message={
                    'custom_notification': notification_options
                }
            )

        return result
