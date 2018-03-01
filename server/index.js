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


function call_numbers(client, number1, number2) {
	var c1 = "";
	console.log("Calling first number...");
	client.Call.create({
		from: process.env.phoneNumber, // This must be a Catapult number on your account
		to: number1,
	})
	.then((message) => {
		var return_message = "Started call with ID " + message.id;
		// callback(null, return_status(200, return_message));
		console.log(return_message);
		c1 = message.id;
		console.log("Calling second number...");
		
		client.Call.create({
			from: process.env.phoneNumber, // This must be a Catapult number on your account
			to: number2,
		})
		.then((message) => {
			var return_message = "Started call with ID " + message.id;
			// callback(null, return_status(200, return_message));
			console.log(return_message);
			client.Bridge.create({
				bridgeAudio: true,
				callIds: [c1, message.id]
			})
			.then(function (response) {
				console.log(response);
				callback(null, return_status(200, "Started calls"));
			});
		})
		.catch((err) => {
			console.log(JSON.stringify(err.message));
			// callback(err.message);
		});
	})
	.catch((err) => {
		console.log(JSON.stringify(err.message));
		// callback(err.message);
	});
	
}
exports.handler = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
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
	if(!body.secret || body.secret != process.env.secret) {
		callback(return_status(400, "Invalid secret"));
	}
	if (body.companyNumber && body.customerNumber) {
		console.log("Got both numbers");
		if (body.message) {
			console.log("Got the message");
			client.Message.send({
					from: process.env.phoneNumber, // This must be a Catapult number on your account
					to: body.customerNumber,
					text: body.message
				})
				.then((message) => {
					return_message = "Message sent with ID " + message.id;
					setTimeout(call_numbers, 6000, client, body.companyNumber, body.customerNumber);
				})
				.catch((err) => {
					console.log(JSON.stringify(err.message));
					callback(err.message);
				});
		} else {
			callback(return_status(400, "Please specify a message"));
		}
	} else {
		callback(return_status(400, "Please specify both numbers"));
	}
};
