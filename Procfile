web: gunicorn server.wsgi
worker: celery --app=server.celery:app worker --loglevel=INFO
