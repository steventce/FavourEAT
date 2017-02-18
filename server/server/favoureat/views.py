from server.favoureat.serializers import SwipeSerializer
from server.models import User, Swipe
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


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
            serializer = SwipeSerializer(swipe, data=request.data)
        else:
            serializer = SwipeSerializer(None, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
