FROM python:3.9-slim

RUN mkdir -p /opt/app
RUN mkdir -p /opt/app/pip_cache
RUN mkdir -p /opt/app/rentserv
COPY requirements.txt /opt/app/
COPY ./server Procfile /opt/app/rentserv/

WORKDIR /opt/app/rentserv
EXPOSE 8020

RUN pip install -r /opt/app/requirements.txt --cache-dir /opt/app/pip_cache