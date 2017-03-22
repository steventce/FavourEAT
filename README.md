# FavourEAT

## Client instructions:
Navigate to the client directory. Run:
```
npm install
```

Create an `env.js` file under the `client/src/config/` folder. Export the URL of your desired server.
```javascript
export const API_BASE_URL = 'http://...';
```

Build and run the project on Android:
```
react-native run-android
```

### Troubleshooting
```
adb devices
adb reverse tcp:8081 tcp:8081
```

## Server instructions:
Using Python 2.7.10, install dependencies from the root folder by running :
```
pip install -r requirements.txt
```

This app uses the [Django Rest Framework Social Oauth2](https://github.com/PhilipGarnero/django-rest-framework-social-oauth2) library for generating tokens. You have to register the social oauth app through the admin panel. The endpoint is under `/admin`. Follow the instructions from the link, specifically the section under: **Now go to django admin and add a new Application.**

Create an `__init__.py` file in the `server/server/settings/` folder for your ids, SECRET keys, and database information.
```python
from server.settings.base import *

SOCIAL_AUTH_FACEBOOK_KEY = 'XYZ...'
SOCIAL_AUTH_FACEBOOK_SECRET = 'XYZ...'
SOCIAL_AUTH_CLIENT_ID = 'XYZ...'
SOCIAL_AUTH_CLIENT_SECRET = 'XYZ...'
YELP_APP_ID = 'XYZ...'
YELP_APP_SECRET = 'XYZ...'
FCM_SERVER_KEY = 'XYZ...'
# ...other private keys

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'db_name',
        'USER': 'user',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': 'port'
    }
} 
```

After modifying the `__init__.py` file, run `git update-index --skip-worktree server/server/settings/__init__.py` from the root directory.
A `__init__.py` is required to be committed in order for Python to recognize that folder as a module, which is needed for loading the production settings properly, but your own personal changes should not be tracked.

Navigate to the folder where `manage.py` file is in and run: 
```
python manage.py migrate
```

When testing the API and need to run server locally: Run the following: 
```
python manage.py runserver
```

To execute the Python unit tests, run:
```
python manage.py test
```


