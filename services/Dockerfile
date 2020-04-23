FROM node:14

ARG UID=1000
ARG GID=1000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

RUN mkdir -p /app
WORKDIR /app

RUN set -ex && \
    npm install && \
    npm run build

CMD [ "npm", "start" ]
