'use strict';

function request(httpMethod, apiEndpoint, requestBody, callback) {
	const https = require('https');
	const httpResponse = require('aws-api-gateway-return');

	const options = {
		hostname: 'api.catapult.inetwork.com',
		path: `/v1/users/${process.env.USER_ID}/${apiEndpoint}`,
		auth: `${process.env.API_TOKEN}:${process.env.API_SECRET}`,
		method: httpMethod,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(requestBody)
		}
	}
	console.log("Making Bandwidth API call with this body:");
	console.log(requestBody);
	console.log("===== End request body =====");
	console.log(JSON.stringify(options));
	console.log("===== End request options =====");

	let req = https.request(options, (resp) => {
		var data = '';

		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			console.log("Bandwidth response: '" + data + "'");
			// TODO verify return data/check docs/return the successful action to the client
			callback(null, httpResponse.create(200, data));
			return;
		});

		resp.on('error', (err) => {
			console.log("Bandwidth error: '" + err.message + "'");
			console.log(err);
			// TODO retry with exponential backoff?
			callback(null, httpResponse.create(500, err.message)); // TODO change from 500 to Bandwidth API status or decide on a status that reflects external API failure
			return;
		})
	});

	req.write(requestBody);
}


exports.post = function (apiEndpoint, requestBody, callback) {
	request('POST', apiEndpoint, requestBody, callback);
};

exports.get = function (apiEndpoint, requestBody, callback) {
	request('GET', apiEndpoint, requestBody, callback);
};
