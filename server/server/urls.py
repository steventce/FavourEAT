"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from favoureat import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    url(r'^v1/token/$', views.TokenView.as_view()),
    url(r'^v1/refresh-token/$', views.RefreshTokenView.as_view()),
    url(r'^v1/users/(?P<user_id>[0-9]+)/$', views.UserView.as_view()),
    url(r'^v1/users/(?P<user_id>[0-9]+)/fcm-token/$', views.FcmTokenView.as_view()),
    url(r'^v1/users/(?P<user>[0-9]+)/swipes/$', views.UserSwipeView.as_view()),
    url(r'^v1/users/(?P<user_id>[0-9]+)/events/$',
        views.EventView.as_view()),
    url(r'^v1/users/(?P<user_id>[0-9]+)/events/(?P<event_id>[0-9]+)/$',
        views.EventDetailsView.as_view()),
    url(r'^v1/users/(?P<user_id>[0-9]+)/events/(?P<event_id>[0-9]+)/rate/$',
        views.EventUserAttachView.as_view()),
    url(r'^v1/users/(?P<user_id>[0-9]+)/join/(?P<invite_code>.*)/$',
        views.JoinEventView.as_view()),
    url(r'^v1/events/(?P<event_id>[0-9]+)/tournament/$',
        views.IndividualTournamentView.as_view()),
    url(r'^auth/', include('rest_framework_social_oauth2.urls')),
    url(r'^admin/', admin.site.urls)
]

urlpatterns = format_suffix_patterns(urlpatterns)
