#!/bin/bash

# Get your API keys here:
#   https://addons.mozilla.org/en-US/developers/addon/api/key/

# Before first run, install web-ext with:
#   $ npm install -g web-ext

cd ..
web-ext sign -s nicetab -v --api-key API_KEY_HERE --api-secret API_SECRET_HERE
open web-ext-artifacts/
