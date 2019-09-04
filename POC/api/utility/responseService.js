'use strict';
const responseService = module.exports;

responseService.getGeneralErrorMessages = (data) => {
	return {
		Bad_Request: {
			success: false,
			status: 400,
			message: (data && data.message) ? data.message : '400N500S'
		},
		Unauthorized: {
			success: false,
			status: 401,
			message: (data && data.message) ? data.message : '400N500S'
		}
	}
};

responseService.validateAndSend = (err, response, req, res, customError) => {
	let stack = new Error().stack;
	let logMsg = {
		stacktrace: stack
	};
	if (err || customError) {
		logMsg.msg = [(!!err ? JSON.stringify(err) : '')].concat([customError]);
		res.status(((err && err.status) ? err.status : (customError && customError.status) ? customError.status : 500)).
		send(responseService.setErrorResponse(customError));
	} else if (response) {
		response = responseService.setSuccessResponse(response);
		res.send(response);
	} else {
		res.send(responseService.setErrorResponse());
	}
};

responseService.logError = (err) => {
	let stack = new Error().stack;
	let logMsg = {
		stacktrace: stack
	};
	if (err) {
		logMsg.msg = err.message;
	}
};

responseService.setErrorResponse = (data) => {
	return {
		status: (data && data.status) ? data.status : 500,
		success: false,
		message: (data && data.message) ? data.message : '400N500S'
	}
};

responseService.setSuccessResponse = (data) => {
	return {
		status: 200,
		success: true,
		message: (data && data.message) ? data.message : (data && data.recordset && data.recordset.length > 0) ?
			'Processed Successfully.' : 'noRecordFound',
		content: (data && data.recordset) ? data.recordset : []
	}
};
