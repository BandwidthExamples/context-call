'use strict';

function return_status(http_code, message_body) {
	console.log("Sending message body as '" + message_body + "'");
	return {
		"statusCode": http_code,
		"headers": {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin" : "*", // Required for CORS support to work
			"Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS
			"X-Requested-With" : "*",
			"Access-Control-Allow-Methods": "POST,GET"
		},
		"body": JSON.stringify({
			"message": message_body
		})
	}
}

function call_number(client, number) {
	client.Call.create({
		from: "+19104271337", // This must be a Catapult number on your account
		to: number,
	})
	.then((message) => {
		var return_message = "Started call with ID " + message.id;
		// callback(null, return_status(200, return_message));
		console.log(return_message);
	})
	.catch((err) => {
		console.log(JSON.stringify(err.message));
		// callback(err.message);
	});
}
exports.handler = (event, context, callback) => {
	if(true) {
		var AWS = require('aws-sdk');
		var params = {
			Name: 'Call NUMBER_HERE', /* required */
			Description: 'Call NUMBER_HERE at TIME_HERE',
			EventPattern: '',
			RoleArn: '',
			ScheduleExpression: 'cron(0,17,21,2,*,2018)',
			State: "ENABLED"
		};

		var cloudwatchevents = new AWS.CloudWatchEvents({apiVersion: '2015-10-07'});
		cloudwatchevents.putRule(params, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else     console.log(data);           // successful response
		});

	}
	console.log(process.env);
	var Bandwidth_API = require("node-bandwidth");
	var client = new Bandwidth_API({
		userId: process.env.userId, // <-- note, this is not the same as the username you used to login to the portal
		apiToken: process.env.apiToken,
		apiSecret: process.env.apiSecret
	});

	var return_message = "";
	console.log("Parsing event: " + JSON.stringify(event));
	let body = JSON.parse(event.body);
	if (body.number) {
		console.log("Got a number");
		if (body.message) {
			console.log("Got a message");
			client.Message.send({
					from: process.env.phoneNumber, // This must be a Catapult number on your account
					to: body.number,
					text: body.message
				})
				.then((message) => {
					return_message = "Message sent with ID " + message.id;
					callback(null, return_status(200, return_message));
					setTimeout(call_number, 60000, client, body.number);
				})
				.catch((err) => {
					console.log(JSON.stringify(err.message));
					callback(err.message);
				});
		} else {
			call_number(client, body.number);
		}
	} else {
		return_message = "Please specify a number";
		callback(null, return_status(400, return_message));
	}
};

