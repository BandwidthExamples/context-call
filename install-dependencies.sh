#!/usr/bin/env bash
# install client dependencies
cd ~/client
npm install
npm install jest

# install server dependencies
cd ~/server
npm install
npm install node-bandwidth

# restore initial working directory
cd ..
