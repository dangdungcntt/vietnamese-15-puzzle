#!/usr/bin/env sh

npm run build-gh

cd ../15-puzzle-gh/

git pull

cd -

cp -r dist/* ../15-puzzle-gh/

cd ../15-puzzle-gh/

git add -A

git commit -m 'deploy'

git push origin main

cd -