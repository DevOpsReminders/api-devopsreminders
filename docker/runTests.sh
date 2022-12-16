#!/bin/sh
docker run --rm \
  -e CI=true \
  angelxmoreno/api-devopsreminders-0.0.0 \
  yarn install && yarn lint && yarn test
