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
		if(err) {
			console.error('Unable to scan the table. Error: ',
				JSON.stringify(err, null, 2));
		} else {
			console.log('Scan succeeded.');
			if(typeof data.LastEvaluatedKey !== 'undefined') {
				console.log('Not all data scanned.');
			}
			callback(null, httpResponse.create(200, data.Items));
			return;
		}
	});
}

function addOrder(orderId, name, phoneNumber, eta, callback) {
	// let db = new AWS.DynamoDB({region: 'us-west-2', apiVersion: '2012-08-10'});
	let docClient = new AWS.DynamoDB.DocumentClient();

	let params = {
		TableName: 'orders',
		Item: {
			'orderId': orderId,
			'name': name,
			'phoneNumber': phoneNumber,
			'eta': eta
		}
	};

	docClient.put(params, (err, data) => {
		if(err) {
			console.error('Unable to add to the table. Error: ',
				JSON.stringify(err, null, 2));
		} else {
			console.log('Added to the table.');
			callback(null, httpResponse.create(200, 'Added: ' + JSON.stringify(data)));
			return;
		}
	});
}

exports.handler = (event, context, callback) => {
	switch(event.httpMethod) {
		case 'GET':
			getOrders(callback);
			break;
		case 'POST':
			const params = event.queryStringParameters;
			if(!params) {
				callback(null, httpResponse.create(401, 'invalid/unspecified query parameters'));
				return;
			}
			const secret = params.secret;
			if(!secret || secret !== process.env.SECRET) {
				callback(null, httpResponse.create(401, 'invalid/unspecified secret'));
				return;
			}
			addOrder(
				params.orderId,
				params.name,
				params.phoneNumber,
				params.eta,
				callback
			);
			break;
	}
};
