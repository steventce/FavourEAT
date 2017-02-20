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

## Server instructions:
Using Python 2.7.10:
```
pip install django
pip install djangorestframework
pip install markdown       # Markdown support for the browsable API.
pip install django-filter  # Filtering support
pip install django-rest-framework-social-oauth2 # For Facebook -> access token generation 
```

This app uses the [Django Rest Framework Social Oauth2](https://github.com/PhilipGarnero/django-rest-framework-social-oauth2) library for generating tokens. You have to register the social oauth app through the admin panel. The endpoint is under `/admin`. Follow the instructions from the link, specifically the section under: **Now go to django admin and add a new Application.**

Create an `__init__.py` file in the `server/server/settings/` folder for your SECRET keys.
```python
from server.settings.base import *

SOCIAL_AUTH_FACEBOOK_SECRET = 'XYZ...'
SOCIAL_AUTH_CLIENT_SECRET = 'XYZ...'
# ...other private keys
```

Navigate to the folder where `manage.py` file is in and run: 
```
python manage.py migrate
```

When testing the API and need to run server locally: Run the following: 
```
python manage.py runserver --settings=server.settings.__init__
```

To execute the Python unit tests, run:
```
python manage.py test
```


