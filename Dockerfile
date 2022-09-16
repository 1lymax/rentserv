FROM registry.semaphoreci.com/python:3.8
# python:3.9-slim

RUN mkdir -p /opt/app
RUN mkdir -p /opt/app/pip_cache
RUN mkdir -p /opt/app/rentserv
COPY requirements.txt /opt/app/
COPY ./server Procfile /opt/app/rentserv/
# COPY  /opt/app/rentserv/rentserv/

WORKDIR /opt/app/rentserv/
EXPOSE 8000

RUN pip install -r /opt/app/requirements.txt --cache-dir /opt/app/pip_cache
RUN python manage.py collectstatic