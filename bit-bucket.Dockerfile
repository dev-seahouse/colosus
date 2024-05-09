# syntax = docker/dockerfile:1.2

FROM node:18.17.1-alpine3.18

RUN apk update && \
    apk upgrade

RUN apk add --no-cache --update python3 py3-pip
RUN apk add --no-cache --update --virtual=build gcc musl-dev python3-dev libffi-dev openssl-dev cargo make
RUN pip3 install --no-cache-dir --prefer-binary azure-cli
RUN apk del build
RUN az --version
