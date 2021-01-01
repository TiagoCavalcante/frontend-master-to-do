#!/bin/bash

cp src/* docs/ -r

cd docs

# compile index.scss
scss index.scss index.css

echo $(sed 's/@charset "UTF-8";//g' index.css) > index.css

echo $(cat index.html) > index.html
echo $(minify index.css) > index.css
echo $(minify index.js) > index.js
echo $(minify sortable.js) > sortable.js

# remove unecessary files
rm index.scss
rm *.map