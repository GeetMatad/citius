'use strict';
let jwt = require('jsonwebtoken');
let config = require('../../config/environmental');
const responseService = require('../../utility/responseService')

exports.getWeekdays = function(req, res) {
		/*res.writeHead(200, {'Content-Type': 'text/html'}); // http header
		var url = req.url;
		if(url ==='/monday'){
			res.write('<h1>moday page<h1>'); //write a response
			res.end(); //end the response
		}else if(url === 'tuesday'){
			res.write('<h1>tuesday World!<h1>'); //write a response
			res.end(); //end the response
		}
		else if(url === 'saturday'){
			res.write('<h1>saturday World!<h1>'); //write a response
			res.end(); //end the response
		}
		else if(url === 'sunday'){
			res.write('<h1>sunday!<h1>'); //write a response
			res.end(); //end the response
		} else{
			res.write('<h1>home page<h1>'); //write a response
			res.end(); //end the response
		}
	})*/
};

exports.login = function(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	// For the given username fetch user from DB
	let mockedUsername = 'test';
	let mockedPassword = 'test';
	let content={}
	if (username && password) {
		if (username === mockedUsername && password === mockedPassword) {
			let token = jwt.sign({username: username},
				config.secret,
				{
					expiresIn: '24h' // expires in 24 hours
				}
			);
			responseService.validateAndSend(null, {
				message: 'loggedin successfully.',
				recordset: {
					userContext: token
				}
			}, null, res);
		} else {
			responseService.validateAndSend(content, null, req, res, {
				status: 200,
				message: "Invalid Credential"
			});
		}
	} else {
		responseService.validateAndSend({
			status: 400,
			message: "Authentication failed! Please check the request"
		}, null, req, res);
	}
};
