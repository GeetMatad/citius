'use strict';
let jwt = require('jsonwebtoken');
let config = require('../../config/environmental')

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

	if (username && password) {
		if (username === mockedUsername && password === mockedPassword) {
			let token = jwt.sign({username: username},
				config.secret,
				{
					expiresIn: '24h' // expires in 24 hours
				}
			);
			// return the JWT token for the future API calls
			res.json({
				success: true,
				message: 'Authentication successful!',
				token: token
			});
		} else {
			res.send(403).json({
				success: false,
				message: 'Incorrect username or password'
			});
		}
	} else {
		res.send(400).json({
			success: false,
			message: 'Authentication failed! Please check the request'
		});
	}
};
const  checkUserValid  = (username,password, cb) => {
	return  username === 'test' && password ==='test'
}