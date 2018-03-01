#!/usr/bin/env bash
# install client dependencies
cd ~/build/BandwidthExamples/context-call/client
npm install

# install server dependencies
cd ~/build/BandwidthExamples/context-call/server
npm install node-bandwidth

# restore initial working directory
cd ~/build/BandwidthExamples/context-call/
