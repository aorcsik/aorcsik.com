#!/bin/sh

./node_modules/.bin/webpack --config webpack.prod.js --progress --colors $@
