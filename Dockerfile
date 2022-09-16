# FROM registry.semaphoreci.com/python:3.8
FROM python:3.9-slim

RUN mkdir -p /opt/app
RUN mkdir -p /opt/app/pip_cache
RUN mkdir -p /opt/app/rentserv
COPY requirements.txt /opt/app/
COPY ./server start-server.sh /opt/app/rentserv/
# COPY Procfile .
# COPY  /opt/app/rentserv/rentserv/

WORKDIR /opt/app/rentserv/
EXPOSE 8020

RUN pip install -r /opt/app/requirements.txt --cache-dir /opt/app/pip_cache
# RUN python manage.py makemigrations
# RUN python manage.py migrate
CMD ["/rentserv/start-server.sh"]
CMD ["/opt/app/rentserv/start-server.sh"]