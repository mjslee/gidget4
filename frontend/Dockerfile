FROM node:8.16.1-alpine

ARG UID=1000
ARG GID=1000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN set -ex && \
    apk update && \
    apk upgrade && \
    npm install && \
    npm run build

CMD [ "npm", "start" ]
