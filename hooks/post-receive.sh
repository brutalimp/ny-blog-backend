#!/bin/bash
TARGET="/home/www/ny-blog-backend"
GIT_DIR="/home/gitrepo/ny-blog-backend.git"
APP_NAME="ny-blog-backend"
BRANCH="master"

echo "post-receive: Triggered."
if [ ! -d "$TARGET" ]; then
  echo "mkdir $TARGET"
  mkdir $TARGET
fi
cd $TARGET

echo "post-receive: git check out..."
git --git-dir=$GIT_DIR  --work-tree=$TARGET checkout -f

echo "yarn add all deps" 
yarn install \
&& echo "post-receive: server start" \
&& (pm2 delete $APP_NAME || true ) \
&& pm2 start app.js --name $APP_NAME \
&& echo "post-receive: done."
