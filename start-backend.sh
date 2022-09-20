#!/usr/bin/env bash
# start_backend.sh

 if [ -n "$PORT" ] ; then
 (gunicorn rentserv.wsgi --bind 0.0.0.0:$PORT --workers 3) ; else
 (gunicorn rentserv.wsgi --bind 0.0.0.0:7000 --workers 3)
 fi

#gunicorn rentserv.wsgi --bind 0.0.0.0:7000 --workers 3