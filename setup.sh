#!/bin/sh

npm install

mkdir ./dist

git clone --depth 1 git@github.com:aorcsik/aorcsik.com.git --branch gh-pages dist
