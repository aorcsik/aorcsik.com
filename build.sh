#!/bin/sh

rm -rf ./dist/*

./node_modules/.bin/webpack --progress --colors $@
