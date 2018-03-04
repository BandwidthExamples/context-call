'use strict';

function callNumber(companyNumber, customerNumber, wait, callback) {
	// customerNumber: 10 digit number to text
	// companyNumber: the number to call once the appropriate wait has elapsed
	// wait: the number of seconds or timestamp to wait until calling companyNumber (e.g., {type:'seconds',seconds:60}, {type:'timestamp',timestamp:'2016-03-14T01:59:00Z'})
	const bandwidthAPI = require('simple-bandwidth-api');

	const postData = JSON.stringify({
		from: process.env.PHONE_NUMBER,
		to: customerNumber,
		callbackUrl: process.env.CALLBACK_WAIT_URL, // the URL of our API endpoint that will handle waiting and then calling
		tag: JSON.stringify({'wait': wait, 'companyNumber': companyNumber, 'customerNumber': customerNumber}) // send the number of seconds to wait until calling as well as both numbers to call
	});

	bandwidthAPI.post('calls', postData, callback);
}

exports.handler = (event, context, callback) => {
	// Make callback() function like return; i.e., exit after its called
	// TODO ensure that this is secure
	const httpResponse = require('aws-api-gateway-return');
	context.callbackWaitsForEmptyEventLoop = false;

	let body = JSON.parse(event.body);
	if(!body.secret || body.secret != process.env.SECRET) {
		callback(null, httpResponse.create(401, "secret was not specified or is invalid"));
	}

	switch(body.request) {
		case 'call':
			callNumber(body.companyNumber, body.customerNumber, callback);
			break;
		case 'bridgeCalls':
			bridgeCalls(body.companyCallID, body.customerCallID, callback);
			break;
	}
};
