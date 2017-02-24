from .base import *
import dj_database_url

DEBUG = False

SECRET_KEY = os.environ.get('SECRET_KEY')

# Parse database configuration from $DATABASE_URL
db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)

SOCIAL_AUTH_FACEBOOK_KEY = os.environ.get('SOCIAL_AUTH_FACEBOOK_KEY')
SOCIAL_AUTH_FACEBOOK_SECRET = os.environ.get('SOCIAL_AUTH_FACEBOOK_SECRET')
SOCIAL_AUTH_CLIENT_ID = os.environ.get('SOCIAL_AUTH_CLIENT_ID')
SOCIAL_AUTH_CLIENT_SECRET = os.environ.get('SOCIAL_AUTH_CLIENT_SECRET')

ALLOWED_HOSTS = ['favoureat.herokuapp.com']


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# Simplified static file serving.
# https://warehouse.python.org/project/whitenoise/
STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'