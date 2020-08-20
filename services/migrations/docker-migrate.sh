#!/usr/bin/env sh

hasura migrate apply --endpoint ${HASURA_ENDPOINT} --admin-secret ${HASURA_ADMIN_SECRET} --skip-update-check
hasura metadata apply --endpoint ${HASURA_ENDPOINT} --admin-secret ${HASURA_ADMIN_SECRET} --skip-update-check
hasura seeds apply --endpoint ${HASURA_ENDPOINT} --admin-secret ${HASURA_ADMIN_SECRET} --skip-update-check

# Do not let the process to end
[ ! -z "$HASURA_KEEPALIVE" ] || while true; do foo; sleep 20; done
