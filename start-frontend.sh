#!/usr/bin/env bash
# start-frontend.sh

cd /opt/app/rentserv/client/
serve -s -n build -l $1

