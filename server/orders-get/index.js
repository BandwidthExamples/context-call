'use strict';

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
      console.error('Unable to scan the table. Error: ',
        JSON.stringify(err, null, 2));
    } else {
      console.log('Scan succeeded.');
      if (typeof data.LastEvaluatedKey !== 'undefined') {
        console.log('Not all data scanned.');
      }
      callback(null, httpResponse.create(200, data.Items));
    }
  });
}

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // if (!event['queryStringParameters']) {
  //   callback(null, httpResponse.create(401, 'invalid/unspecified query parameters'));
  // }
  // const secret = event['queryStringParameters']['secret'];
  // if (!secret || secret !== process.env.SECRET) {
  //   callback(null, httpResponse.create(401, 'invalid/unspecified secret'));
  // }

  // switch (event['queryStringParameters']['request']) {
  //   case 'ping':
  //     callback(null, httpResponse.create(200, 'ready'));
  //     break;
  //   case 'getOrders':
  getOrders(callback);
  // break;
  // }
};
