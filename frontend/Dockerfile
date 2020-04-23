FROM node:13-stretch

ARG UID=1000
ARG GID=1000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=4000
ENV NPM_ARGS='--only=prod'

RUN mkdir -p /app
COPY . /app

WORKDIR /app
RUN set -ex && \
    apt-get update && \
    apt-get install -y libsass-dev && \
    npm install $NPM_ARGS && \
    npm run build

CMD ["npm", "start"]
