#!/usr/bin/env bash
# exit on error
set -o errexit

npm install --legacy-peer-deps
npm run build
