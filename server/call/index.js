'use strict';

function callNumber(customerNumber, companyNumber, wait, callback) {
	// customerNumber: 10 digit number to text
	// companyNumber: the number to call once the appropriate wait has elapsed
	// wait: the number of seconds or timestamp to wait until calling companyNumber (e.g., {type:'seconds',seconds:60}, {type:'timestamp',timestamp:'2016-03-14T01:59:00Z'})
	let bandwidthAPI = require('BandwidthAPI');

	const postData = JSON.stringify({
		from: process.env.phoneNumber,
		to: customerNumber,
		text: message,
		receiptRequested: 'all', // request SMS delivery reciept
		callbackUrl: 'https://requestb.in/1ms0s7g1', // the URL of our API endpoint that will handle waiting and then calling
		tag: JSON.stringify({'wait': wait, 'companyNumber': companyNumber, 'customerNumber': customerNumber}) // send the number of seconds to wait until calling as well as both numbers to call
	});

	bandwidthAPI.post('messages', postData, callback);
}

exports.handler = (event, context, callback) => {
	// Make callback() function like return; i.e., exit after its called
	// TODO ensure that this is secure
	httpReponse = require('aws-api-gateway-return');
	context.callbackWaitsForEmptyEventLoop = false;

	let body = JSON.parse(event.body);
	if(!body.secret || body.secret != process.env.secret) {
		callback(null, httpResponse(401, "secret was not specified or is invalid"));
	}

	switch(body.request) {
		case 'call':
			bridgeCalls(body.companyNumber, body.customerNumber, callback);
			break;
		case 'bridgeCalls':
			sendSMS(body.companyCallID, body.customerCallID, callback);
			break;
	}
};
