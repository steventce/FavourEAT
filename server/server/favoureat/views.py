from server.favoureat.serializers import SwipeSerializer
from server.models import User, Swipe
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class UserSwipeView(APIView):
    """
    POST: add a swipe decision for user
    """
    def get_object(self, yelp_id, user):
        try:
            return Swipe.objects.get(yelp_id=yelp_id, user=user)
        except Swipe.DoesNotExist:
            return False

    def post(self, request, user, format=None):
        if User.objects.filter(id=user).count() == 0:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
        request.data['user'] = user

        swipe = self.get_object(request.data['yelp_id'], request.data['user'])
        if not swipe:
            serializer = SwipeSerializer(swipe, data=request.data)
        else:
            serializer = SwipeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
