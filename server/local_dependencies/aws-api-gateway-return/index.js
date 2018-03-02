exports.returnStatus = (httpCode, messageBody) {
		// httpCode: the HTTP status code to send
		// messageBody: the response text itself
	return {
		"statusCode": httpCode,
		// TODO remove headers from here and specify in API Gateway
		"headers": {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin" : "*", // Required for CORS support to work
			"Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS
			"X-Requested-With" : "*",
			"Access-Control-Allow-Methods": "POST,GET"
		},
		"body": JSON.stringify({
			"message": messageBody
		})
	}
}

