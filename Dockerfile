FROM python:3.9-slim

RUN apt-get update && apt-get install nginx vim -y --no-install-recommends
COPY nginx.default /etc/nginx/sites-enabled/
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIP_ROOT_USER_ACTION=ignore

RUN mkdir -p /opt/app
RUN mkdir -p /opt/app/pip_cache
RUN mkdir -p /opt/app/rentserv
COPY requirements.txt start-server.sh /opt/app/
RUN chmod 755 opt/app/start-server.sh

# COPY ./pip_cache /opt/app/pip_cache/
COPY ./server /opt/app/rentserv/
WORKDIR /opt/app/rentserv

RUN pip install -r /opt/app/requirements.txt --cache-dir /opt/app/pip_cache

RUN chown -R www-data:www-data /opt/app

EXPOSE 8020
STOPSIGNAL SIGTERM
CMD ["/opt/app/start-server.sh"]