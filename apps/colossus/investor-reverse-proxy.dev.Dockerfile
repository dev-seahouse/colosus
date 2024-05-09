# syntax = docker/dockerfile:1.2

FROM nginx:1.23.4-alpine3.17

COPY apps/colossus/investor-reverse-proxy.dev.conf /etc/nginx/conf.d/default.conf
