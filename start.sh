#!/usr/bin/env bash
# start.sh
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] ; then
    (cd server; python manage.py createsuperuser --no-input)
fi
cd ..
gunicorn rentserv.wsgi --bind 0.0.0.0:8000 --workers 3 --daemon

if [ -n "$PORT" ] ; then
(serve -s build -l $PORT) ; else
(serve -s build -l 8020); fi

# &
# nginx -g "daemon off;"