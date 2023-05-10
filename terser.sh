#!/bin/bash

rootDir=$(cd "$(dirname "$0")" ; pwd -P)

cd "$rootDir"

files="$(find static/scripts -type f -name '*.js')"

for file in $files; do
  ./node_modules/.bin/terser "$file" --compress --ecma 6 --mangle toplevel --output "$file" --source-map "content=$file.map,filename=$file.map,url=$(basename -- $file).map"
done
