'use strict';

function send_sms(tag, callback) {
	// TODO NLP; save to DynamoDB
	// customerNumber: 10 digit number to text
	// message: the text message itself
	// companyNumber: the number to call once the appropriate waitValue has elapsed
	// waitType: the type of delay (i.e., 'seconds' or 'timestamp')
	// waitValue: the number of seconds or timestamp to wait until calling companyNumber (e.g., '60' or '2016-03-14T01:59:00Z')
	const bandwidthAPI = require('simple-bandwidth-api');

	const postData = JSON.stringify({
		from: process.env.PHONE_NUMBER,
		to: tag.customerNumber,
		text: tag.message,
		receiptRequested: 'all', // request SMS delivery reciept
		callbackUrl: process.env.CALLBACK_TEXT_URL, // the URL of our API endpoint that will handle waiting and then calling
		tag: JSON.stringify(tag) // send the wait types and wait values between texting and calling as well as both numbers to call
	});

	bandwidthAPI.post('messages', postData, callback);
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
		case 'message_customer':
			tag.request = 'ensure_message_delivery';
			send_sms(tag, callback);
			break;
		case 'ensure_message_delivery':
			if(!('deliveryState' in body)) {
				// this shouldn't happen unless something weird is going on
				callback(null, httpResponse.create(400, "no delivery state"));
			}
			if (body.deliveryState != 'delivered') {
				// not delivered yet, so keep waiting
				callback(null, httpResponse.create(200, "okay"));
			} else {
				const AWS = require('aws-sdk');
				const crypto = require('crypto');
				let stepfunctions = new AWS.StepFunctions();
				let params = {
					stateMachineArn: process.env.STEP_FUNCTION_ARN,
					input: JSON.stringify({'body':tag}),
					name: crypto.createHash('md5').update(JSON.stringify(tag)).digest("hex") // we now have idempotent executions // TODO ensure this occurs before the text is sent or decide to get rid of this line
				};
				stepfunctions.startExecution(params, function(err, data) {
					if (err)	console.log(err, err.stack); // an error occurred
					else		callback(null, httpResponse.create(200, "okay")); // successful response
				});
			}
			break;
		default:
			callback(null, httpResponse.create(400, "invalid request"));
			break;
	}
};
