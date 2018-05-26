#!/bin/bash
TARGET="/home/www/ny-blog-backend"
GIT_DIR="/home/gitrepo/ng-blog-backend.git"
APP_NAME="ny-blog-backend"
BRANCH="master"

echo "post-receive: Triggered."
cd $TARGET

echo "post-receive: git check out..."
git --git-dir=$GIT_DIR  --work-tree=$TARGET checkout $BRANCH -f

echo "install pm2" \
&& npm install pm2 -g \
&& echo "npm install" \
&& npm install \
&& echo "post-receive: server start" \
&& (pm2 delete $APP_NAME || true ) \
&& pm2 start app.js --name $APP_NAME \
&& echo "post-receive: done."
