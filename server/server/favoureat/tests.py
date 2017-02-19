from rest_framework.test import APITestCase
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate
from rest_framework import status
from django.contrib.auth.models import User
from server.favoureat.views import UserView, TokenView

class UserTests(APITestCase):
    def test_success_get_user(self):
        """ Ensure that a user can be retrieved """
        user_id = 2
        name = 'bob'
        user = User.objects.create(username=name)
        self.assertEqual(User.objects.count(), 1)

        url = ''.join(['/v1/users', '/', str(user_id)])
        factory = APIRequestFactory()
        request = factory.get(url)
        force_authenticate(request, user=user)

        view = UserView.as_view()
        response = view(request, pk=user.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected = { 'first_name': '', 'last_name': '', 'id': user_id }
        self.assertEqual(response.data, expected)

    def test_error_no_token(self):
        """ Ensure that the endpoint requires an access token """
        user_id = 2
        user = User.objects.create(username='bob')
        self.assertEqual(User.objects.count(), 1)

        url = ''.join(['/v1/users', '/', str(user_id)])
        response = self.client.get(url, follow=True, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class TokenTests(APITestCase):
    def test_error_invalid_token(self):
        """ Ensure that an invalid client token throws an error """
        data = {
            'access_token': 'IrboBALZBYWtfMQSeHmxZBZBbDwsqPpIfl3ySsgaOlwEnZCmpc'
        }
        url = '/v1/token/'
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_error_no_token(self):
        """ Ensure that an error is handled elegantly when there is no access token """
        data = { 'access_token': '' }
        url = '/v1/token/'
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
