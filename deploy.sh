#!/bin/sh

./build.sh -p

cd dist
git add --all
git commit -m "Release at $(date)"
git push
