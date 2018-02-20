#!/usr/bin/env bash
#install client dependencies
cd client
npm install
#install server dependencies
cd ../server
npm install
#restore initial working directory
cd ..