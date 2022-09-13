# pull official base image
FROM python:3.9.6-alpine

# set work directory
WORKDIR /app

# set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
# RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY ./server .
# COPY rentserv.sql .
# RUN cat ./rentserv.sql | docker exec -i db psql -U postgres
# COPY C:\Program Files\PostgreSQL\14\data /var/lib/postgresql/data