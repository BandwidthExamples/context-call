#!/usr/bin/env bash
# install client dependencies
cd ~/server
npm cache clean
cd ~/client
npm cache clean
find
cat /home/travis/client/package.json
cat package.json
npm install

# install server dependencies
cd ~/server
npm install node-bandwidth

# restore initial working directory
cd ..
