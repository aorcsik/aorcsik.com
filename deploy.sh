#!/bin/sh

rm -rf ./dist

git clone --depth 1 git@github.com:aorcsik/aorcsik.com.git --branch gh-pages dist

./build.sh -p

cp CNAME ./dist/CNAME
cp -R ./public/keybase.txt ./dist/keybase.txt

cd dist
git add --all
git commit -m "Release at $(date)"
git push
