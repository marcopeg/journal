#!/usr/bin/env sh

hasura migrate apply --endpoint ${HASURA_ENDPOINT} --admin-secret ${HASURA_ADMIN_SECRET} --skip-update-check
hasura metadata apply --endpoint ${HASURA_ENDPOINT} --admin-secret ${HASURA_ADMIN_SECRET} --skip-update-check
hasura seeds apply --endpoint ${HASURA_ENDPOINT} --admin-secret ${HASURA_ADMIN_SECRET} --skip-update-check

# Do not let the process to end
if [ -z "${HASURA_KEEPALIVE}" ]
then
    echo "Migrations completed, exiting the process."
else
    echo "Migrations completed, keeping the process alive forever."
    while true; do sleep 20; done
fi