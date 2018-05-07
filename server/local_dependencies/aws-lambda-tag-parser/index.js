'use strict';

const httpResponse = require('aws-api-gateway-return');

exports.parse = function(body, callback) {
	/*
	Example usage:
		const tagParser = require('aws-lambda-tag-parser');
		const body = JSON.parse(event.body);

		let tag = tagParser.parse(body);
		if (!tag) {
			return;
		}
	*/
	if (!('tag' in body)) {
		callback(null, httpResponse.create(400, "unspecified tag; body is " + JSON.stringify(body)));
		return false;
	}

	const body_tag = JSON.parse(body.tag);
	let tag = {};
	for(let parameter in ['waitType', 'waitValue', 'companyNumber', 'customerNumber', 'secret', 'request']){
		if (!(parameter in tag)) {
			callback(null, httpResponse.create(400, "invalid tag (missing `" + parameter + "`)"));
			return false;
		} else {
			// to ensure tag doesn't contain unnecessary parameters (viz., from a malicious client)
			tag[parameter] = body_tag[parameter];
		}
	}

	if(tag.secret != process.env.SECRET) {
		callback(null, httpResponse.create(401, "invalid secret"));
		return false;
	}

	return tag; // everything looks good
}