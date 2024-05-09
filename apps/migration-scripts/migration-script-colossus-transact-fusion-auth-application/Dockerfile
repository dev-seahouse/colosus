# syntax = docker/dockerfile:1.2

FROM --platform=$BUILDPLATFORM node:18.17.1-alpine3.18 as base

# Patch OS Lib Issues and set workdir
RUN apk update && \
    apk upgrade && \
    mkdir /app && \
    chown node:node /app

USER node
WORKDIR /app

# We are doing this because we want to cache the node_modules more effectively.
# Prior to this, we just did "COPY --chown=node:node . ." and then "yarn install --frozen-lockfile".
# The issue here is that even a small change in the codebase will invalidate all the cache after that command,
# even if dependencies never changed.
# So, we are doing a two-step process here:
# 1. Copy only the package.json and yarn.lock files, and install dependencies.
# 2. Copy the rest of the codebase and install dependencies again.
#    This is for the prepare command that generates the Prisma client.
# This way, we can cache the dependencies more effectively.
# Ref: https://docs.docker.com/build/cache/#order-your-layers

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile --ignore-scripts --prefer-offline && \
    yarn list

COPY --chown=node:node . .

RUN yarn prepare:db-schema-generator && ls -l

FROM --platform=$BUILDPLATFORM base as builder

RUN yarn nx run migration-scripts-migration-script-colossus-transact-fusion-auth-application:build:production --verbose && ls -l

FROM --platform=$BUILDPLATFORM base as deps

RUN yarn install --frozen-lockfile --ignore-scripts --prod && \
    ls -l


FROM --platform=$BUILDPLATFORM node:18.17.1-alpine3.18

# Patch OS Lib Issues and set workdir
RUN apk update && \
    apk upgrade && \
    addgroup --system colossus && \
    adduser --system -G colossus colossus && \
    mkdir /app && \
    chown colossus:colossus /app

USER colossus
WORKDIR /app


COPY --chown=colossus:colossus --from=deps /app/node_modules ./node_modules

COPY --chown=colossus:colossus --from=builder /app/dist/apps/migration-scripts/migration-script-colossus-transact-fusion-auth-application ./

RUN yarn install --production --ignore-scripts --prefer-offline --frozen-lockfile && \
    yarn list

RUN ls -ls

CMD ["node", "main.js"]
