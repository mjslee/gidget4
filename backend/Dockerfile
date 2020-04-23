FROM php:7.3-fpm

ARG UID=1000
ARG GID=1000

RUN mkdir -p /app
COPY . /app

COPY --from=composer:1.10.5 /usr/bin/composer /usr/bin/composer

WORKDIR /app
RUN set -ex && \
    apt-get update && \
    apt-get install -y \
        git \
        libtool \
        zip unzip \
        libpq-dev && \
    docker-php-ext-install pdo pdo_pgsql && \
    /usr/bin/composer install && \
    usermod -u $UID www-data && \
    groupmod -g $GID www-data
