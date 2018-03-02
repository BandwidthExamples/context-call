#!/usr/bin/env bash
# deploy client to s3
# cd ${TRAVIS_BUILD_DIR}/client/
# rm -r node_modules
# npm install --production

# deploy text server to lambda
cd ${TRAVIS_BUILD_DIR}/server/text/
rm -r node_modules
npm install --production
#aws lambda create-function --function-name "ContextCallV2Text" --role $AWS_LAMBDA_ROLE --region $AWS_LAMBDA_REGION --runtime "nodejs6.10" --handler "handler" --zip-file server_text.zip
aws lambda update-function-code --fuction-name "ContextCallV2Text" --zip-file server_text.zip --environment "Variables={SECRET=$AWS_LAMBDA_ENV_SECRET,API_SECRET=$AWS_LAMBDA_ENV_API_SECRET,API_TOKEN=$AWS_LAMBDA_ENV_API_TOKEN,PHONE_NUMBER=$AWS_LAMBDA_ENV_PHONE_NUMBER,USER_ID=$AWS_LAMBDA_ENV_USER_ID}"

# deploy call server to lambda
cd ${TRAVIS_BUILD_DIR}/server/call/
rm -r node_modules
npm install --production
#aws lambda create-function --function-name "ContextCallV2Call" --role $AWS_LAMBDA_ROLE --region $AWS_LAMBDA_REGION --runtime "nodejs6.10" --handler "handler" --zip-file server_call.zip
aws lambda update-function-code --fuction-name "ContextCallV2Call" --zip-file server_call.zip --environment "Variables={SECRET=$AWS_LAMBDA_ENV_SECRET,API_SECRET=$AWS_LAMBDA_ENV_API_SECRET,API_TOKEN=$AWS_LAMBDA_ENV_API_TOKEN,PHONE_NUMBER=$AWS_LAMBDA_ENV_PHONE_NUMBER,USER_ID=$AWS_LAMBDA_ENV_USER_ID}"
