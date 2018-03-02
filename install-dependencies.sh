#!/usr/bin/env bash
# install client dependencies
cd ${TRAVIS_BUILD_DIR}/client/
npm install

# install server dependencies
cd ${TRAVIS_BUILD_DIR}/server/text/
npm install

cd ${TRAVIS_BUILD_DIR}/server/call/
npm install

# restore initial working directory
cd ${TRAVIS_BUILD_DIR}/
