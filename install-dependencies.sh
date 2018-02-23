#!/usr/bin/env bash
# install client dependencies
cd ~/server
npm cache clean
cd ~/client
npm cache clean
npm install

# install server dependencies
cd ~/server
npm install
npm install node-bandwidth

# restore initial working directory
cd ..
