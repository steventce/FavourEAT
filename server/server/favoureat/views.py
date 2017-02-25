from django.conf import settings
from django.contrib.auth.models import User
from server.favoureat.serializers import UserSerializer
from server.favoureat.serializers import SwipeSerializer
from server.models import User, Swipe
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_social_oauth2.views import ConvertTokenView

import json

class UserView(APIView):
    """
    Gets a single User instance.
    """
    def get_object(self, pk, user):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response('User not found', status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk, format=None):
        if int(pk) != int(request.user.id):
            return Response('Bad request', status=status.HTTP_400_BAD_REQUEST)
        user = self.get_object(pk, request.user)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UserSwipeView(APIView):
    """
    POST: add a swipe decision for user
    """
    def post(self, request, user, format=None):
        if User.objects.filter(id=user).count() == 0:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
        request.data['user'] = user
        swipe = Swipe.objects.filter(yelp_id=request.data['yelp_id'], user=request.data['user'])
        if swipe.exists():
            serializer = SwipeSerializer(swipe[0], data=request.data)
        else:
            serializer = SwipeSerializer(None, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TokenView(ConvertTokenView):
    """
    Creates a new FavourEAT app user. By sending a request with:
    Authorization: Bearer facebook <<fb_token>>, a new app user
    will be created by the social auth library.

    Params: access_token

    References:
    https://github.com/PhilipGarnero/django-rest-framework-social-oauth2/issues/58
    https://github.com/PhilipGarnero/django-rest-framework-social-oauth2/blob/master/rest_framework_social_oauth2/views.py
    """
    def post(self, request, format=None):
        global status
        if request.user.id is None:
            return Response('User not created', status=status.HTTP_400_BAD_REQUEST)
        request._request.POST = request._request.POST.copy()

        request._request.POST['grant_type'] = 'convert_token'
        request._request.POST['client_id'] = settings.SOCIAL_AUTH_CLIENT_ID
        request._request.POST['client_secret'] = settings.SOCIAL_AUTH_CLIENT_SECRET
        request._request.POST['backend'] = 'facebook'
        request._request.POST['token'] = request.data.get('access_token')

        url, headers, body, status = self.create_token_response(request._request)
        data = json.loads(body)
        data['user_id'] = request.user.id
        response = Response(data, status=status)

        for k, v in headers.items():
            response[k] = v
        return response
