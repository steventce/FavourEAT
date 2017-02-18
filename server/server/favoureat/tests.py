from rest_framework.test import APITestCase
from server.models import User, Swipe
from rest_framework import status
# Create your tests here.


class UserSwipeTests(APITestCase):
    def test_save_swipe(self):
        """ Ensure we can save a user swipe decision """
        user = User.objects.create(fb_id='139530')
        user.save()
        print "users"
        print User.objects.values_list('fb_id', flat=True)

        data = {'user': user.id,
                'yelp_id': 49391,
                'right_swipe_count': 1,
                'left_swipe_count': 0}
        url = '/v1/users/' + str(data['user']) + '/swipes/'
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Swipe.objects.count(), 1)
        self.assertEqual(Swipe.objects.get().yelp_id, data['yelp_id'])
        self.assertEqual(Swipe.objects.get().right_swipe_count, data['right_swipe_count'])
        self.assertEqual(Swipe.objects.get().left_swipe_count, data['left_swipe_count'])

    def test_error_save_swipe(self):
        """Ensure that error occurs if we try to save a swipe decision with nonexisting user"""
        data = {'user': 16,
                'yelp_id': 54623,
                'right_swipe_count': 9,
                'left_swipe_count': 0}
        url = '/v1/users/' + str(data['user']) + '/swipes/'
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_malformed_save_swipe(self):
        """Ensure that error occurs if we try to save a swipe decision when data is malformed"""
        user = User(fb_id='139530')
        user.save()
        data = {'user': user.id,
                'yelp_id': 54623,
                'right_swipe_count': 'hello',
                'left_swipe_count': 'goodbye'}
        url = '/v1/users/' + str(data['user']) + '/swipes/'
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
