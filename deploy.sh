#!/usr/bin/env bash

set -ex

git stash
git branch -D build || true
git checkout -b build master
grunt
rm -f .gitignore
git add -A dist/
git commit -m "deploy"
git push heroku `git subtree split --prefix dist build`:master --force
git checkout master
git stash pop
