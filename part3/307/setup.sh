#! /bin/sh

set -e

apk update

apk add --no-cache postgresql-client

rm -rf /var/cache/apk/*
