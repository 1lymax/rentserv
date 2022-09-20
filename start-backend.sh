#!/usr/bin/env bash
# start.sh

a=$1
cd ..
gunicorn rentserv.wsgi --bind 0.0.0.0:${a:1} --workers 3 --daemon