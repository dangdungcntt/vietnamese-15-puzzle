#!/usr/bin/env sh

npm run build-gh

cp -r dist/* ../15-puzzle-gh/

cd ../15-puzzle-gh/

git add -A

git commit -m 'deploy'

git push origin main

cd -