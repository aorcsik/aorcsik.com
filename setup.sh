#!/bin/sh

npm install

mkdir ./dist

git clone git@github.com:aorcsik/aorcsik.com.git --branch gh-pages dist
