'use strict';

function http_post(callback_url, requestBody, callback_url) {
	const https = require('https');
	const url = require('url');

	const options = {
		hostname: url.parse(callback_url).hostname,
		path: url.parse(callback_url).pathname,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(requestBody)
		}
	};

	let req = https.request(options, (resp) => {
		var data = '';
		
		resp.on('data', (chunk) => {
			data += chunk;
		});
		
		resp.on('end', () => {
			callback(null, "");
		});

		resp.on('error', (err) => {
			callback(err); // TODO retry if necessary and/or save state in DB
		});
	});

	req.write(requestBody);
}

/*
event = {
	"wait": {
		"type": "seconds",
		"seconds": 3
	},
	"callback_url": "https://requestb.in/1isra2i1",
	"tag": "{\"request\":\"call\",\"secret\":\"password\",\"companyNumber\":\"+15558675309\",\"customerNumber\":\"+12223334444\"}"
}
*/
exports.handler = (event, context, callback) => {
	// Make callback() function like return; i.e., exit after its called
	// TODO ensure that this is secure
	const httpResponse = require('aws-api-gateway-return');
	context.callbackWaitsForEmptyEventLoop = false;
	
	http_post(event.callback_url, JSON.stringify({body: event.tag}), callback);
	// TODO check for secret in event.secret
};
