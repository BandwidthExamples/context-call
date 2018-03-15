'use strict';

function callNumber(number, tag, callback) {
	// customerNumber: 10 digit number to text
	// companyNumber: the number to call once the appropriate wait has elapsed
	// callback: the callback function to return to
	const bandwidthAPI = require('simple-bandwidth-api');

	const postData = JSON.stringify({
		from: process.env.PHONE_NUMBER,
		to: number,
		callbackUrl: process.env.CALLBACK_WAIT_URL, // the URL of our API endpoint that will handle waiting and then calling
		tag: JSON.stringify(tag)
	});

	bandwidthAPI.post('calls', postData, callback);
}

function bridgeCalls(idOne, idTwo, callback) {
	const bandwidthAPI = require('simple-bandwidth-api');
	callback("not defined");
}

exports.handler = (event, context, callback) => {
	// Make callback() function like return; i.e., exit after its called
	// TODO ensure that this is secure
	const httpResponse = require('aws-api-gateway-return');
	context.callbackWaitsForEmptyEventLoop = false;

	let body = JSON.parse(event.body);
	switch(body.deliveryState) {
		case 'waiting':
			// text message was sent but no delivery report yet
			callback(null, httpResponse.create(200, "")); // acknowledge the callback
			break;
		case 'delivered':
			// continue running
			// TODO move subsequent code to this block
			break;
	}
	let tag = JSON.parse(body.tag); // our state, defined by the previous lambda call
	if(!tag.secret || tag.secret != process.env.SECRET) {
		callback(null, httpResponse.create(401, "secret was not specified or is invalid"));
	}

	switch(tag.request) {
		case 'call':
			// we'll set our number and the new tag depending on what step we're on
			let number = "";
			let new_tag = {};
			if(tag.companyNumber) {
				new_tag.request = 'call';
				number = tag.companyNumber;
				new_tag.customerNumber = tag.customerNumber;
			} else if (tag.companyNumber) {
				new_tag.request = 'bridgeCalls';
				number = tag.companyNumber;
				new_tag.customerCallId = body.callId;
			}
			callNumber(number, new_tag, callback);
			break;
		case 'bridgeCalls':
			bridgeCalls(body.callId, tag.customerCallId, callback);
			break;
	}
};
