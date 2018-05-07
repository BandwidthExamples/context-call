'use strict';

function callNumber(tag, callback) {
	// customerNumber: 10 digit number to call
	// companyNumber: the number to call once the appropriate wait has elapsed
	// callback: the callback function to return to
	const bandwidthAPI = require('simple-bandwidth-api');

	const postData = JSON.stringify({
		from: process.env.PHONE_NUMBER,
		to: tag.companyNumber,
		callbackUrl: process.env.CALLBACK_CALL_URL, // the URL of our API endpoint that will handle waiting and then calling
		tag: JSON.stringify(tag)
	});

	bandwidthAPI.post('calls', postData, callback);
}

function bridgeCalls(idOne, idTwo, callback) {
	const bandwidthAPI = require('simple-bandwidth-api');
	
	const postData = JSON.stringify({
		callIds: [idOne, idTwo]
	});
	bandwidthAPI.post('bridges', postData, callback);
}

exports.handler = (event, context, callback) => {
	const httpResponse = require('aws-api-gateway-return');
	const tagParser = require('aws-lambda-tag-parser');

	const body = JSON.parse(event.body);

	let tag = tagParser.parse(body, callback);
	if (!tag) {
		return;
	}

	switch(tag.request) {
		case 'call_company':
			tag.request = 'ensure_company_answer';
			callNumber(tag.companyNumber, tag, callback);
			break;

		case 'ensure_company_answer':
			if (!('eventType' in body && body.eventType == 'answer')){
				callback(null, httpResponse.create(400, "no answer event"));
			}
			tag.companyCallId = body.callId;
			tag.request = 'ensure_customer_answer';
			callNumber(tag.customerNumber, tag, callback);
			break;

		case 'ensure_customer_answer':
			if (!('eventType' in body && body.eventType == 'answer')){
				callback(null, httpResponse.create(400, "no answer event"));
			}
			tag.customerCallId = body.callId;
			bridgeCalls(tag.customerCallId, tag.companyCallId, callback);
			break;
	}
};
