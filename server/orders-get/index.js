'use strict';

/*
// Configuring the AWS SDK
var AWS = require('aws-sdk');
AWS.config.update({region: 'REGION'});

exports.handler = (event, context, callback) => {

const URL_BASE = "S3_BUCKET_URL";

// Define the object that will hold the data values returned
var slotResults = {
	'isWinner' : false,
	'leftWheelImage' : {'file' : {S: ''}},
	'middleWheelImage' : {'file' : {S: ''}},
	'rightWheelImage' : {'file' : {S: ''}}
};

// define parameters JSON for retrieving slot pull data from the database
var thisPullParams = {
    Key : {'slotPosition' : {N: ''}},
    TableName: 'slotWheels',
    ProjectionExpression: 'imageFile'
};

// create DynamoDB service object
var request = new AWS.DynamoDB({region: 'REGION', apiVersion: '2012-08-10'});

// set a random number 0-9 for the slot position
thisPullParams.Key.slotPosition.N = Math.floor(Math.random()*10).toString();
// call DynamoDB to retrieve the image to use for the Left slot result
var myLeftPromise = request.getItem(thisPullParams).promise().then(function(data) {return URL_BASE + data.Item.imageFile.S});

// set a random number 0-9 for the slot position
thisPullParams.Key.slotPosition.N = Math.floor(Math.random()*10).toString();
// call DynamoDB to retrieve the image to use for the Left slot result
var myMiddlePromise = request.getItem(thisPullParams).promise().then(function(data) {return URL_BASE + data.Item.imageFile.S});

// set a random number 0-9 for the slot position
thisPullParams.Key.slotPosition.N = Math.floor(Math.random()*10).toString();
// call DynamoDB to retrieve the image to use for the Left slot result
var myRightPromise = request.getItem(thisPullParams).promise().then(function(data) {return URL_BASE + data.Item.imageFile.S});


Promise.all([myLeftPromise, myMiddlePromise, myRightPromise]).then(function(values) {
    slotResults.leftWheelImage.file.S = values[0];
    slotResults.middleWheelImage.file.S = values[1];
    slotResults.rightWheelImage.file.S = values[2];
    // if all three values are identical, the spin is a winner
    if ((values[0] === values[1]) && (values[0] === values[2])) {
        slotResults.isWinner = true;
    }
    // return the JSON result to the caller of the Lambda function
    callback(null, slotResults);
});

};

 */

const AWS = require('aws-sdk');
const httpResponse = require('aws-api-gateway-return');
AWS.config.update({region: 'us-west-2'});

function getOrders(callback) {
  // let db = new AWS.DynamoDB({region: 'us-west-2', apiVersion: '2012-08-10'});
  let docClient = new AWS.DynamoDB.DocumentClient();

  let params = {
    TableName: 'orders'
  };

  docClient.scan(params, (err, data) => {
    if (err) {
      console.error('Unable to scan the table. Error: ', JSON.stringify(err, null, 2));
    } else {
      console.log('Scan succeeded.');
      data.Items.forEach((order) => {
        console.log('Order: ' + JSON.stringify(order));
      });
      callback(null, httpResponse.create(200, '...orders...'));
      if (typeof data.LastEvaluatedKey !== "undefined") {
        console.log('Not all data scanned.');
      }
    }
  });
}

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const body = JSON.parse(event.body);
  if (!body.secret || body.secret !== process.env.SECRET) {
    callback(null, httpResponse.create(401, 'invalid/unspecified secret'));
  }

  switch (body.request) {
    case 'ping':
      callback(null, httpResponse.create(200, 'ready'));
      break;
    case 'getOrders':
      getOrders(callback);
      break;
  }
};
