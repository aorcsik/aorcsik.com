#!/bin/sh

ARTIFACT_NAME=artifact.tar.gz
ARTIFACT_PATH=`pwd`/$ARTIFACT_NAME
DEPLOY_PATH=/var/www/aorcsik/

tar -cvz -f "$ARTIFACT_PATH" ./build
scp "$ARTIFACT_PATH" "root@178.62.215.72:${DEPLOY_PATH}${ARTIFACT_NAME}"
ssh root@178.62.215.72 'bash -s' < ./remote.sh

rm $ARTIFACT_PATH
