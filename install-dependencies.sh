#!/usr/bin/env bash
# install client dependencies
cd ${TRAVIS_BUILD_DIR}/client/
npm install

# install server dependencies
cd ${TRAVIS_BUILD_DIR}/server/text/
npm install

cd ${TRAVIS_BUILD_DIR}/server/call/
npm install

cd ${TRAVIS_BUILD_DIR}/server/local_dependencies/aws-api-gateway-return
npm install --production

cd ${TRAVIS_BUILD_DIR}/server/local_dependencies/simple-bandwidth-api
npm install --production

# restore initial working directory
cd ${TRAVIS_BUILD_DIR}/

# pip install awscli --upgrade --user
