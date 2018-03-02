'use strict';

function send_sms(customerNumber, message, companyNumber, delay, callback) {
	// TODO NLP, datestamp calculation from specified delay, save to DynamoDB
	// customerNumber: 10 digit number to text
	// message: the text message itself
	// companyNumber: the number to call once the appropriate delay has elapsed
	// delay: the number of seconds or timestamp to delay until calling companyNumber (e.g., {type:'seconds',seconds:60}, {type:'timestamp',timestamp:'2016-03-14T01:59:00Z'})
	bandwidthAPI = require('simple-bandwidth-api');

	const postData = JSON.stringify({
		from: process.env.PHONE_NUMBER,
		to: customerNumber,
		text: message,
		receiptRequested: 'all', // request SMS delivery reciept
		callbackUrl: 'https://requestb.in/1ms0s7g1', // the URL of our API endpoint that will handle delaying and then calling
		tag: JSON.stringify({'delay': delay, 'companyNumber': companyNumber, 'customerNumber': customerNumber}) // send the delay between texting and calling as well as both numbers to call
	});

	bandwidthAPI('POST', 'messages', postData, callback);
}

exports.handler = (event, context, callback) => {
	// Make callback() function like return; i.e., exit after its called
	// TODO ensure that this is securei
	httpResponse = require('aws-api-gateway-return');
	context.callbackWaitsForEmptyEventLoop = false;
	
	let body = JSON.parse(event.body);
	if(!body.secret || body.secret != process.env.SECRET) {
		callback(null, httpResponse(401, "invalid/unspecified secret"));
	}

	switch(body.request) {
		case 'ping':
			callback(null, httpResponse(200, "ready"));
			break;
		case 'textCustomer':
			send_sms(body.companyNumber, body.message, body.customerNumber, body.delay, callback);
			break;
	}
};
