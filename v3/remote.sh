#!/bin/sh

ARTIFACT_NAME=artifact.tar.gz
DEPLOY_PATH=/var/www/aorcsik/
NEW_PATH=/var/www/aorcsik/build/
CURRENT_PATH=/var/www/aorcsik.com/web/
BACKUP_PATH=/var/www/aorcsik.com/backup/

mkdir $NEW_PATH
tar -xvf ${DEPLOY_PATH}${ARTIFACT_NAME} -C $DEPLOY_PATH
chown -R www-data $NEW_PATH
rm -rf $BACKUP_PATH
mv $CURRENT_PATH $BACKUP_PATH
mv $NEW_PATH $CURRENT_PATH
rm ${DEPLOY_PATH}${ARTIFACT_NAME}
