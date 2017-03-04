from django.contrib import admin
from django.apps import apps

# Register models in admin
app = apps.get_app_config('server')

for name, model in app.models.items():
    admin.site.register(model)
