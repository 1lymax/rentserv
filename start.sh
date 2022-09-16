#!/usr/bin/env bash
# start.sh
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] ; then
    (cd server; python manage.py createsuperuser --no-input)
fi

if [ -n "$PORT" ] ; then
(gunicorn rentserv.wsgi --bind 0.0.0.0:$PORT --workers 3) ; else
(gunicorn rentserv.wsgi --bind 0.0.0.0:8020 --workers 3) ; fi

# &
# nginx -g "daemon off;"