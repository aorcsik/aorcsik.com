#!/bin/sh

./build.sh

cd dist
git add --all
git commit -m "Release at $(date)"
git push
