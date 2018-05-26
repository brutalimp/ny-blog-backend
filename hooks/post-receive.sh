#!/bin/bash
TARGET="/home/www/ny-blog-backend"
GIT_DIR="/home/gitrepo/ny-blog-backend.git"
APP_NAME="ny-blog-backend"
BRANCH="master"


echo "post-receive: Triggered."
cd $TARGET

if [ ! -d "$TARGET" ]; then
  echo "mkdir $TARGET"
  mkdir $TARGET
fi

echo "post-receive: git check out..."
git --git-dir=$GIT_DIR  --work-tree=$TARGET checkout $BRANCH -f

echo "yarn add" 
&& yarn add \
&& echo "post-receive: server start" \
&& (pm2 delete $APP_NAME || true ) \
&& pm2 start app.js --name $APP_NAME \
&& echo "post-receive: done."
