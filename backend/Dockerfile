FROM php:7.2-fpm-alpine

ARG UID=1000
ARG GID=1000

RUN mkdir -p /backend
WORKDIR /backend
COPY . /backend

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN set -ex && \
    apk --no-cache add shadow postgresql-dev && \
    docker-php-ext-install pdo pdo_pgsql && \
    usermod -u $UID www-data && \
    groupmod -g $GID www-data
