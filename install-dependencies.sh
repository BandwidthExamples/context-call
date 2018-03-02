#!/usr/bin/env bash
# install client dependencies
cd ~/build/BandwidthExamples/context-call/client/
npm install

# install server dependencies
cd ~/build/BandwidthExamples/context-call/server/text/
npm install

cd ~/build/BandwidthExamples/context-call/server/call/
npm install

# restore initial working directory
cd ~/build/BandwidthExamples/context-call/
