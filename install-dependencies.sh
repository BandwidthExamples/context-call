#!/usr/bin/env bash
# install client dependencies
find
cd ~/client
cat /home/travis/client/package.json
cat package.json
npm install

# install server dependencies
cd ~/server
npm install node-bandwidth

# restore initial working directory
cd ..
