# FROM registry.semaphoreci.com/python:3.8
FROM nikolaik/python-nodejs:python3.10-nodejs16-slim

RUN mkdir -p /opt/app
RUN mkdir -p /opt/app/pip_cache
RUN mkdir -p /opt/app/rentserv
COPY requirements.txt /opt/app/
COPY ./server start.sh /opt/app/rentserv/
COPY ./client /opt/app/rentserv/client/
RUN chown -R www-data:www-data /opt/app

ARG PORT
# RUN if [ -n $PORT ] ; then $P = $PORT ; fi
EXPOSE $PORT

WORKDIR /opt/app/rentserv/
RUN pip install -r /opt/app/requirements.txt --cache-dir /opt/app/pip_cache
RUN python manage.py makemigrations
RUN python manage.py migrate

WORKDIR /opt/app/rentserv/client/
RUN npm ci --legacy-peer-deps
RUN npm run build
# RUN npm test

RUN chmod 755 /opt/app/rentserv/start.sh

CMD /opt/app/rentserv/start.sh