#!/usr/bin/env bash
# start-frontend.sh

cd /opt/app/rentserv/client/
if [ -n "$PORT" ] ; then
(serve -s -n build -l $PORT) ; else
(serve -s -n build -l 7020)
fi

