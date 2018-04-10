'use strict';

const AWS = require('aws-sdk');
const httpResponse = require('aws-api-gateway-return');
AWS.config.update({region: 'us-west-2'});

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
		if (err) {
			console.error('Unable to add to the table. Error: ',
				JSON.stringify(err, null, 2));
		} else {
			console.log('Added to the table.');
			callback(null, httpResponse.create(200, 'Added: ' + JSON.stringify(data)));
		}
	});
}

exports.handler = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;

	if (!event['queryStringParameters']) {
		callback(null,
			httpResponse.create(401, 'invalid/unspecified query parameters'));
	}
	const secret = event['queryStringParameters']['secret'];
	if (!secret || secret !== process.env.SECRET) {
		callback(null, httpResponse.create(401, 'invalid/unspecified secret'));
	}
	addOrder(
		event['queryStringParameters']['orderId'],
		event['queryStringParameters']['name'],
		event['queryStringParameters']['phoneNumber'],
		event['queryStringParameters']['eta'],
		callback
	);
};
