#!/usr/bin/env bash
# start_backend.sh

python manage.py makemigrations
python manage.py migrate
 if [ -n "$PORT" ] ; then
 (gunicorn rentserv.wsgi --bind 0.0.0.0:$PORT --workers 3) ; else
 (gunicorn rentserv.wsgi --bind 0.0.0.0:8000 --workers 3)
 fi

#gunicorn rentserv.wsgi --bind 0.0.0.0:7000 --workers 3