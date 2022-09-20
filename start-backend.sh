#!/usr/bin/env bash
# start.sh

cd ..
gunicorn rentserv.wsgi --bind 0.0.0.0:$1 --workers 3 --daemon