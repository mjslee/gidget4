FROM nginx:1.17-alpine

ARG SERVER=_
ARG BACKEND=backend:9000
ARG FRONTEND=frontend:4000

COPY nginx.conf.template /tmp/nginx.conf.template

RUN apk add --no-cache gettext && \
    envsubst '$SERVER $BACKEND $FRONTEND' < \
        /tmp/nginx.conf.template > /etc/nginx/conf.d/default.conf
