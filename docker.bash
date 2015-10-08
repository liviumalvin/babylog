#!/bin/bash

# Removes a docker container if it exists
remove() {
  CONTAINER=$1
  TEST=$(docker ps --all | grep $CONTAINER)
  if [ ! -z "$TEST" ]
  then
    docker stop $CONTAINER
    docker rm $CONTAINER
  fi
}

# Runs the node docker image with the proper settings for babylog
node() {
  remove babylog_node && docker run \
    --name babylog_node \
    -p 25601:25601 \
    --link babylog_mongo \
    -v $PWD:/usr/src/myapp \
    -w /usr/src/myapp \
    -e "NODE_ENV=docker" \
    node \
    npm start # command
}

# Runs the mongodb image with the proper settings for babylog
mongo() {
  remove babylog_mongo && docker run \
    --name babylog_mongo \
    -d \
    -v $PWD/data:/data/db \
    mongo
}

# Invoke the command
$@
