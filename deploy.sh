#!/usr/bin/env bash

set -ex

git stash
git branch -D build || true
git checkout -b build master
grunt
git add -Af dist/
git commit -m "deploy"
git push heroku build:master --force
git checkout master
git stash pop
