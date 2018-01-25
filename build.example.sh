#!/bin/bash

cd ..
web-ext sign -s nicetab -v --api-key API_KEY_HERE --api-secret API_SECRET_HERE
open web-ext-artifacts/
