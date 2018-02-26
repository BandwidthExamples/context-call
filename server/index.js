'use strict';

function bandwidth_api(httpMethod, apiEndpoint, requestBody) {
	const https = require('https');

	const options = {
		hostname: 'api.catapult.inetwork.com',
		path: `/v1/users/${process.env.userId}/${apiEndpoint}`,
		auth: `${process.env.apiToken}:${process.env.apiSecret}`,
		method: httpMethod,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(requestBody)
		}
	}

	let req = https.request(options, (resp) => {
		let data = '';

		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			console.log(data);
		});

		resp.on('error', (err) => {
			console.log("Error: " + err.message);
			// retry with exponential backoff?
		})
	});

	req.write(requestBody);
}

function send_sms(customerNumber, message, companyNumber, wait) {
	// customerNumber: 10 digit number to text
	// message: the text message itself
	// companyNumber: the number to call once the appropriate wait has elapsed
	// wait: the number of seconds or timestamp to wait until calling companyNumber (e.g., {type:'seconds',seconds:60}, {type:'timestamp',timestamp:'2016-03-14T01:59:00Z'})
	const postData = JSON.stringify({
		from: process.env.phoneNumber,
		to: customerNumber,
		text: message,
		receiptRequested: 'all', // request SMS delivery reciept
		callbackUrl: 'https://requestb.in/1ms0s7g1', // the URL of our API endpoint that will handle waiting and then calling
		tag: JSON.stringify({'wait': wait, 'companyNumber': companyNumber, 'customerNumber': customerNumber}) // sebd the number of seconds to wait until calling and both numbers to call
	});

	bandwidth_api('POST', 'messages', postData);
}

exports.handler = (event, context, callback) => {
	// Make callback() function like return;
	context.callbackWaitsForEmptyEventLoop = false;

	// userId: process.env.userId, // <-- note, this is not the same as the username you used to login to the portal
	// apiToken: process.env.apiToken,
	// apiSecret: process.env.apiSecret
	
	let body = JSON.parse(event.body);
	if(!body.secret || body.secret != process.env.secret) {
		callback("secret was not specified or is invalid");
	}

	if(body.ping) {
		callback(null, "ready");
	}

	if(!body.companyNumber || !/\+(\d){11,13}/.test(body.companyNumber)) {
		callback("companyNumber was not specified or is malformed");
	}

	if(!body.customerNumber || !/\+(\d){11,13}/.test(body.customerNumber)) {
		callback("customerNumber was not specified or is malformed");
	}

	if(!body.message) {
		callback("message was not specified or is invalid");
	}

	if(!body.wait) {
		body.wait = {
			type: 'seconds',
			seconds: 60
		};
	}

	send_sms(body.customerNumber, body.message, body.companyNumber, body.wait);
};