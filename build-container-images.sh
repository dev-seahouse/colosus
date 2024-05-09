#!/bin/bash

set -e

export DOCKER_BUILDKIT=1

docker build -f apps/colossus/Dockerfile . -t bambugoacr.azurecr.io/base-ci-image:latest-amd64 --build-arg BUILDKIT_INLINE_CACHE=1 --progress plain --target base --cache-from bambugoacr.azurecr.io/base-ci-image:latest-amd64 --platform linux/amd64
docker push bambugoacr.azurecr.io/base-ci-image:latest-amd64
docker build -f apps/colossus/Dockerfile . -t bambugoacr.azurecr.io/colossus:latest-amd64 --build-arg BUILDKIT_INLINE_CACHE=1 --progress plain --cache-from bambugoacr.azurecr.io/base-ci-image:latest-amd64 --platform linux/amd64
docker build -f apps/colossus/db.setup.slim.Dockerfile . -t bambugoacr.azurecr.io/colossus-db-setup:latest-amd64 --build-arg BUILDKIT_INLINE_CACHE=1 --progress plain --cache-from bambugoacr.azurecr.io/base-ci-image:latest-amd64 --platform linux/amd64
docker build -f apps/cron-jobs/cron-wealth-kernel-token-renewal/Dockerfile . -t bambugoacr.azurecr.io/cron-wk-connector-renew:latest-amd64 --build-arg BUILDKIT_INLINE_CACHE=1 --progress plain --cache-from bambugoacr.azurecr.io/base-ci-image:latest-amd64 --platform linux/amd64
docker build -f apps/cron-jobs/cron-wealth-kernel-investor-account-sync/Dockerfile . -t bambugoacr.azurecr.io/cron-wk-account-sync:latest-amd64 --build-arg BUILDKIT_INLINE_CACHE=1 --progress plain --cache-from bambugoacr.azurecr.io/base-ci-image:latest-amd64 --platform linux/amd64
docker build -f apps/cron-jobs/cron-syncronize-model-portfolio-wk-models/local.Dockerfile . -t bambugoacr.azurecr.io/cron-wk-model-sync:latest-amd64 --build-arg BUILDKIT_INLINE_CACHE=1 --progress plain --cache-from bambugoacr.azurecr.io/base-ci-image:latest-amd64 --platform linux/amd64
docker build -f apps/wealth-kernel-connector/Dockerfile . -t bambugoacr.azurecr.io/wealth-kernel-connector:latest-amd64 --build-arg BUILDKIT_INLINE_CACHE=1 --progress plain --cache-from bambugoacr.azurecr.io/base-ci-image:latest-amd64 --platform linux/amd64
