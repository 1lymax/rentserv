#!/usr/bin/env bash
# start.sh
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] ; then
    (cd server; python manage.py createsuperuser --no-input)
fi

gunicorn rentserv.wsgi --bind 0.0.0.0:$PORT --workers 3
# &
# nginx -g "daemon off;"