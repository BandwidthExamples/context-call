function request(httpMethod, apiEndpoint, requestBody, callback) {
	const https = require('https');

	const options = {
		hostname: 'api.catapult.inetwork.com',
		path: `/v1/users/${process.env.userId}/${apiEndpoint}`,
		auth: `${process.env.apiToken}:${process.env.apiSecret}`,
		method: httpMethod,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(requestBody)
		}
	}

	let req = https.request(options, (resp) => {
		let data = '';

		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			console.log(data);
			// TODO verify return data/check docs/return the successful action to the client
			callback(null, return_status(200, ""));
		});

		resp.on('error', (err) => {
			console.log("Error: " + err.message);
			console.log(err);
			// TODO retry with exponential backoff?
			callback(null, return_status(500, err.message)); // TODO change from 500 to Bandwidth API status or decide on a status that reflects external API failure
		})
	});

	req.write(requestBody);
}


exports.post = (apiEndpoint, requestBody, callback) {
	request('POST', apiEndpoint, requestBody, callback);
}

exports.get = (apiEndpoint, requestBody, callback) {
	request('GET', apiEndpoint, requestBody, callback);
}
