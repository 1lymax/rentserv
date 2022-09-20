#!/usr/bin/env bash
# start.sh

if [ -n "$PORT" ] ; then
(gunicorn rentserv.wsgi --bind 0.0.0.0:$PORT --workers 3 --daemon) ; else
(gunicorn rentserv.wsgi --bind 0.0.0.0:8020 --workers 3 --daemon)
fi