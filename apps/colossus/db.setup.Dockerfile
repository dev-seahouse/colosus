# syntax = docker/dockerfile:1.2

FROM --platform=$BUILDPLATFORM node:18.17.1-alpine3.18

RUN apk update && \
    apk add --no-cache python3 py3-pip make g++ && \
    ln -sf python3 /usr/bin/python && \
    python3 -m ensurepip && \
    pip3 install --no-cache --upgrade pip setuptools wheel && \
    mkdir /app && \
    chown node:node /app

USER node
WORKDIR /app

COPY --chown=node:node . .

RUN yarn install --frozen-lockfile
