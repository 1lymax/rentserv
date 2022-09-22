#!/usr/bin/env bash
# start_backend.sh

python manage.py makemigrations
python manage.py migrate
gunicorn rentserv.wsgi --bind 0.0.0.0:8000 --workers 3 --daemon

cd /opt/app/rentserv/client/
serve -s -n build -l 8020