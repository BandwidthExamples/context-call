'use strict';

function send_sms(customerNumber, message, companyNumber, waitType, waitValue, callback) {
	// TODO NLP; save to DynamoDB
	// customerNumber: 10 digit number to text
	// message: the text message itself
	// companyNumber: the number to call once the appropriate waitValue has elapsed
	// waitType: the type of delay (i.e., 'seconds' or 'timestamp')
	// waitValue: the number of seconds or timestamp to wait until calling companyNumber (e.g., '60' or '2016-03-14T01:59:00Z')
	const bandwidthAPI = require('simple-bandwidth-api');

	const postData = JSON.stringify({
		from: process.env.PHONE_NUMBER,
		to: customerNumber,
		text: message,
		receiptRequested: 'all', // request SMS delivery reciept
		callbackUrl: process.env.CALLBACK_WAIT_URL, // the URL of our API endpoint that will handle waiting and then calling
		tag: JSON.stringify({'waitType': waitType, 'waitValue': waitValue, 'companyNumber': companyNumber, 'customerNumber': customerNumber, 'secret': process.env.SECRET, 'request': 'call'}) // send the wait types and wait values between texting and calling as well as both numbers to call
	});

	bandwidthAPI.post('messages', postData, callback);
}

exports.handler = (event, context, callback) => {
	// Make callback() function like return; i.e., exit after its called
	// TODO ensure that this is securei
	const httpResponse = require('aws-api-gateway-return');
	context.callbackWaitsForEmptyEventLoop = false;
	
	const body = JSON.parse(event.body);
	if(!body.secret || body.secret != process.env.SECRET) {
		callback(null, httpResponse.create(401, "invalid/unspecified secret"));
	}

	switch(body.request) {
		case 'ping':
			callback(null, httpResponse.create(200, "ready"));
			break;
		case 'textCustomer':
			send_sms(body.customerNumber, body.message, body.companyNumber, body.waitType, body.waitValue, callback);
			break;
	}
};
