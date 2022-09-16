#!/usr/bin/env bash
# start-server.sh
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] ; then
    (cd server; python manage.py createsuperuser --no-input)
fi
cd server
gunicorn rentserv.wsgi --bind 0.0.0.0:8020 --workers 3
# &
# nginx -g "daemon off;"