from __future__ import absolute_import

import os
from celery import Celery
from django.conf import settings

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

if os.environ.get('ENV') == 'PROD':
	app = Celery('server', backend=os.environ.get('REDIS_URL'), broker=os.environ.get('REDIS_URL'))
	# app.conf.update(BROKER_URL=os.environ['REDIS_URL'],
	# 	CELERY_RESULT_BACKEND=os.environ['REDIS_URL'])
else:
	app = Celery('server', backend='redis://localhost:6379/0', broker='redis://localhost:6379/0')



# Using a string here means the worker will not have to
# pickle the object when using Windows.
app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
