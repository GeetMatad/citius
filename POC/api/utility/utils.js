/**
 * Created by kanchan-anthwal on 17/7/2018
 */

'use strict';

const moment = require('moment');
const DocumentManagerUtility = require('./DocumentManagerUtility');
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-');
const uuid = require('uuid/v4');
const constantConfig = require('../config/admin/constantConfig');
const _ = require('lodash');
const multer = require('multer');
const fs = require('fs');
const logger = require('./logger');
const httpntlm = require('httpntlm');
const encryption = require('./encryption');

const DEFAULT_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss:SSS';
const DATE_FORMAT_1 = 'DD/MM/YYYY';

const PAYMENT_REDIRECT_ID = 'afd7d00feaf63c08816741b2cf8ed63c';

const EMAIL_TEMPLATES = {
	REGISTER: 'Register',
	FORGOT_PASSWORD: 'forgotpassword',
	RESET_PASSWORD_OFFLINE: 'PasswordResetOffline',
	PAYMENT_SUCCESS: 'Online_PaymentSuccess_Email',
	VAF_NOTELIGIBLE: 'VAFPDF_NotEligible_Email'
};

const PDF = {
	PAYMENT_PDF: 'Online_PaymentSuccess_PDF'
};

const REPORT_FORMAT = {
	PLAIN: 'plain',
	EXCEL: 'excel',
	PDF: 'pdf'
};

const REPORTS_NAME = {
	REMITTANCE: 'remittance_report',
	APPLICATION_STATUS: 'visa_application_status_report',
	YTD: 'ytd_report',
	StaffWise_Productivity_Report: 'staffwise_productivity_report',
	Daily_Report: 'daily_report',
	Finance_Report: 'finance_report',
	ThaiAirwaysTravelerReport: 'thai_airways_traveler_report'
};

const REPORTS_SP = {
	REMITTANCE: 'PROC_Remittance_Report',
	APPLICATION_STATUS: 'PROC_VFS_Application_Status_Report',
	PROC_StaffWiseProductivity_Report: 'PROC_StaffWiseProductivity_Report',
	YTD: 'PROC_YTD_Report',
	Daily_Report: 'PROC_Daily_Report',
	Finance_Report: 'PROC_Finance_Report',
	ThaiAirwaysTravelerReport: 'PROC_ThaiAirwaysTravelerReport'
};

const MST_STATUS_LIST = {
	ONBOARDING: "OnBoarding",
	PASSPORT_DETAILS: "PassportDetails",
	TRAVEL_DETAILS: "TravelDetails",
	ACCOMMODATION_DETAILS: "AccommodationDetails",
	DOCUMENT_UPLOAD: "DocumentUpload",
	SECURITY_QA: "SecurityQA",
	VAF: "VAF",
	DISCLAIMER_ACCEPTANCE: "Disclaimer",
	SUMMARY: "Summary",
	PAYMENT_INITIATE: "PaymentInitiate",
	PAYMENT_SUCCESS: "PaymentSuccess",
	VFS_HOLD: "VFSHold",
	PENDING_DOCUMENT_UPLOADED: "PendingDocumentUploaded"
};

const MST_LANG_ID = {
	'en-US': 1,
	'ja-JP': 2,
	'fr-FR': 3
};

const COUNTRY_DEFAULT = '0';
const COUNTRY_CATEGORY_RESIDENCE = '1';
const COUNTRY_CATEGORY_CURRENT_NATIONALITY = '2';
const COUNTRY_CATEGORY_BIRTH_COUNTRY = '3';
const _MS_PER_DAY = 1000 * 60 * 60 * 24;

const THAI_IN_MILLISEC_PER_HOUR = 1000 * 60 * 60 * 7;

const utils = {};
const path = require('path');
var MAGIC_NUMBERS = {
	jpg: 'ffd8ffe0',
	pdf: '25504446'
};

function checkMagicNumbers(magic) {
	if (magic == MAGIC_NUMBERS.jpg || magic == MAGIC_NUMBERS.pdf) return true
}

utils.isValid = (req) => {
	var buffer = req.file.buffer;
	var magic = buffer.toString('hex', 0, 4);
	return checkMagicNumbers(magic);
};

utils.applicantDocUpload = multer({
	limits: {
		fileSize: constantConfig.fileSize
	},
	fileFilter: function (req, file, cb) {
		const extensionArray = file.originalname.split(".");
		if ((['jpg', 'jpeg', 'pdf'].indexOf((file.mimetype.split("/")[1]).toLowerCase()) > -1) && (['jpg', 'jpeg', 'pdf', 'blob'].indexOf((extensionArray[extensionArray.length - 1]).toLowerCase()) > -1)) {
			cb(null, true);
		} else {
			cb(null, false);
		}
	}
});

utils.getCurrentDate = (format) => {
	return (format ? moment.utc(new Date()).format(format) : moment.utc(new Date()).format(DEFAULT_TIME_FORMAT));
};

utils.formatDate = (date, format) => {
	return (format ? moment(date).format(format) : moment(date).format(DEFAULT_TIME_FORMAT));
};

utils.convertDateInUTC = (date) => {
	return (date ? moment.utc(date).format(DEFAULT_TIME_FORMAT) : null);
};

utils.appendTimeDateInUTC = (date) => {
	return moment.utc(date + " " + moment.utc().format('HH:mm:ss:SSS')).format(DEFAULT_TIME_FORMAT);
};

utils.matchDates = (date1, date2) => {
	return utils.strictCompare(+date1, +date2);
};

utils.isArrayEmpty = (arr) => {
	return !(!!arr && Array.isArray(arr) && arr.length > 0);
};

utils.strictCompare = (val1, val2) => {
	return (val1 === val2);
};

utils.isLessThanCompare = (date1, date2) => {
	return (date1 < date2);
};

/**
 * Below Function Creates Insert statement based on input data(Object)
 * Output is specifies values required after successful insert.
 * */
utils.createInsertStatement = (tableName, data, Output) => {
	data.CreatedDateTime = utils.getCurrentDate();
	data.ModifiedBy = data.CreatedBy;
	data.ModifiedDateTime = utils.getCurrentDate();
	const KeyList = Object.keys(data);
	let query = 'INSERT INTO ' + tableName + '(';
	let values = ` VALUES(`;
	let added = false;
	let val = [];
	for (let i = 0; i < KeyList.length; i++) {
		if ((typeof data[KeyList[i]] == 'number' && data[KeyList[i]] != null) || (data[KeyList[i]] != '' && data[KeyList[i]] != null)) {
			if (added) {
				query += ',';
				values += ',';
			}
			query += KeyList[i];
			values += '@' + KeyList[i];
			val.push({key: KeyList[i], value: data[KeyList[i]]})
			added = true;
		}
	}
	query += ')';
	if (!!Output) {
		query += ' Output Inserted.' + Output;
	}
	
	query += values + ' )';
	
	return ({query: query, val: val})
	
};

utils.createUpdateStatement = (tableName, data, updatedBy, whereObj) => {
	data.ModifiedBy = updatedBy;
	data.ModifiedDateTime = utils.getCurrentDate();
	let query = " UPDATE " + tableName + "  SET ";
	const KeyList = Object.keys(data);
	let added = false;
	let val = [];
	for (let i = 0; i < KeyList.length; i++) {
		if (added) {
			query += ',';
		}
		query += KeyList[i] + '=@' + KeyList[i];
		val.push({key: KeyList[i], value: data[KeyList[i]]})
		added = true;
	}
	query += ` WHERE `;
	if (!Array.isArray(whereObj)) {
		query += whereObj.key + ` = '` + whereObj.value + "'";
	} else {
		for (let i = 0; i < whereObj.length; i++) {
			if (i > 0) query += ' AND ';
			query += whereObj[i].key + ` = '` + whereObj[i].value + "'";
		}
	}
	return ({query: query, val: val})
};

utils.createMultipleUpdateSingleFieldStatement = (tableName, updatedBy, field, value, whereObj) => {
	whereObj.value = whereObj.value
		.filter((val) => {
			if (!!val)
				return val;
		});
	const val = [
		{key: "answer", value: String(value)},
		{key: "ModifiedBy", value: updatedBy},
		{key: "ModifiedDateTime", value: utils.getCurrentDate()},
	]
	let query = " UPDATE " + tableName + "  SET " + field + ` = @answer , ModifiedBy = @ModifiedBy , ModifiedDateTime =@ModifiedDateTime `;
	query += ` WHERE ` + whereObj.key + ` IN (` + whereObj.value + `)`;
	return ({query: query, val: val})
};

utils.createInsertStatementWithoutBasicData = (tableName, data, Output) => {
	const KeyList = Object.keys(data);
	let query = 'INSERT INTO ' + tableName + '(';
	let values = ` VALUES(`;
	let added = false;
	let val = [];
	for (let i = 0; i < KeyList.length; i++) {
		if ((typeof data[KeyList[i]] == 'number' && data[KeyList[i]] != null) || (data[KeyList[i]] != '' && data[KeyList[i]] != null)) {
			if (added) {
				query += ',';
				values += ',';
			}
			query += KeyList[i];
			values += '@' + KeyList[i];
			val.push({key: KeyList[i], value: data[KeyList[i]]})
			added = true;
		}
	}
	query += ')';
	if (!!Output) {
		query += ' Output Inserted.' + Output;
	}
	query += values + ' )';
	return ({query: query, val: val})
};

utils.generateBasicDataForInsert = (CreatedBy) => {
	if (!!CreatedBy) {
		return [
			{key: 'CreatedBy', value: CreatedBy},
			{key: 'CreatedDateTime', value: utils.getCurrentDate()},
			{key: 'ModifiedBy', value: CreatedBy},
			{key: 'ModifiedDateTime', value: utils.getCurrentDate()}
		]
	} else {
		return [];
	}
};

utils.generateBasicDataForUpdate = (UpdatedBy) => {
	if (!!UpdatedBy) {
		return [
			{key: 'ModifiedBy', value: UpdatedBy},
			{key: 'ModifiedDateTime', value: utils.getCurrentDate()}
		]
	} else {
		return [];
	}
};

utils.getGenericErrorMsg = (module) => {
	return {
		message: 'Unable to process ' + module + ' details'
	}
};

utils.generateId = () => {
	let id = shortid();
	return id.toString().replace('--', 'PK').replace('-', 'A').replace('__', 'KA').replace('_', 'G');
};

utils.getUUID = () => {
	return uuid()
};

utils.dateDiffInDays = (date1, date2) => {
	const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
	const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
	
	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

utils.compareStringWithToLowerCaseAndStrictType = (string1, string2) => {
	return (string1 && string2) ? string1.toString().toLowerCase() === string2.toString().toLowerCase() : false;
};

utils.sqlInClauseQueryBuilder = (query, columnParam, inputArray) => {
	const paramObject = [];
	_.each(inputArray, (item, index) => {
		if (index === 0) {
			query += ' WHERE ';
		}
		query += `${columnParam} = @${columnParam}${index} ${(index + 1 < inputArray.length) ? ' OR ' : ''}`;
		paramObject.push({key: columnParam + index, value: item});
	});
	return {query: query, paramObject: paramObject};
};

utils.uploadDocument = function (file, name) {
	return new Promise(function (resolve, reject) {
		DocumentManagerUtility.upload(file, name, function (err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		})
	})
};

utils.createFileName = function (originalfilename) {
	var date = new Date();
	var fileName = constantConfig.foldername + '/' + date.getFullYear() + '/' + date.getMonth() + '/' + shortid.generate().substring(0, 8);
	if (originalfilename && originalfilename.indexOf(".") > -1) {
		originalfilename = originalfilename.substring(originalfilename.lastIndexOf("."), originalfilename.length);
		return fileName + originalfilename;
	} else
		return fileName;
};

utils.getAccessDetails = (req) => {
	let logObj = {
		UserAgent: req.headers['user-agent'],
		IPAddress: req.body.ipaddress,
		LoginDateTime: utils.getCurrentDate(),
		Browser: req.body.browser,
		Source: ''
	};
	req.device = {
		type: ''
	};
	const ua = req.headers['user-agent'];
	if (/mobile/i.test(ua)) {
		logObj.Source = 'Mobile';
	}
	if (/like Mac OS X/.test(ua)) {
		if (/CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.')) {
			logObj.Source = 'ios';
			//'ios' +/CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.')
		}
		if (/iPhone/.test(ua)) {
			logObj.Source = 'iPhone';
		}
		if (/iPad/.test(ua)) {
			logObj.Source = 'iPad';
		}
	}
	if (/Android/.test(ua)) {
		if (/Android ([0-9\.]+)[\);]/.exec(ua)[1]) {
			logObj.Source = 'Android Phone';
			//'Android Phone'+ /Android ([0-9\.]+)[\);]/.exec(ua)[1];
		}
	}
	if (logObj.Source == '') {
		logObj.Source = "DESKTOP"
	}
	return logObj;
};

utils.downloadDocument = (name) => {
	return new Promise((resolve, reject) => {
		DocumentManagerUtility.download(name, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		})
	})
};

utils.deleteFileFromSystemByPassingPathAsyncMethod = (filePath) => {
	fs.stat(filePath, (err) => {
		if (err) logger.error(err);
		fs.unlink(filePath, (err) => {
			if (err) return logger.error(err);
			logger.info('File deleted successfully');
		});
	});
};

utils.getDateString = (dateString) => {
	const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
		"JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
	];
	
	let date = new Date(dateString);
	date.setDate(date.getDate());
	date = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
	
	return date;
};

utils.sharePointDownload = (sharePointLink) => {
	return new Promise((resolve, reject) => {
		try {
			httpntlm.get({
				url: sharePointLink.replace('wynvfsdvpcapp01', constantConfig.sharePointIP),
				username: constantConfig.username,
				password: encryption.decrypt(constantConfig.password),
				workstation: '',
				domain: constantConfig.domain,
				binary: true
			}, function (err, response) {
				if (err) {
					reject(err);
				} else {
					resolve(response.body);
				}
			});
		} catch (e) {
			reject(e);
		}
	})
};

module.exports = {
	getCurrentDate: utils.getCurrentDate,
	isArrayEmpty: utils.isArrayEmpty,
	convertDateInUTC: utils.convertDateInUTC,
	strictCompare: utils.strictCompare,
	isLessThanCompare: utils.isLessThanCompare,
	DATE_FORMAT_1: DATE_FORMAT_1,
	createInsertStatement: utils.createInsertStatement,
	createUpdateStatement: utils.createUpdateStatement,
	createMultipleUpdateSingleFieldStatement: utils.createMultipleUpdateSingleFieldStatement,
	COUNTRY_DEFAULT: COUNTRY_DEFAULT,
	COUNTRY_CATEGORY_RESIDENCE: COUNTRY_CATEGORY_RESIDENCE,
	COUNTRY_CATEGORY_CURRENT_NATIONALITY: COUNTRY_CATEGORY_CURRENT_NATIONALITY,
	COUNTRY_CATEGORY_BIRTH_COUNTRY: COUNTRY_CATEGORY_BIRTH_COUNTRY,
	generateBasicDataForInsert: utils.generateBasicDataForInsert,
	getGenericErrorMsg: utils.getGenericErrorMsg,
	generateId: utils.generateId,
	getUUID: utils.getUUID,
	commonUtilityMethods: utils,
	uploadDocument: utils.uploadDocument,
	createFileName: utils.createFileName,
	getAccessDetails: utils.getAccessDetails,
	createInsertStatementWithoutBasicData: utils.createInsertStatementWithoutBasicData,
	generateBasicDataForUpdate: utils.generateBasicDataForUpdate,
	EMAIL_TEMPLATES: EMAIL_TEMPLATES,
	REPORT_FORMAT: REPORT_FORMAT,
	REPORTS_NAME: REPORTS_NAME,
	REPORTS_SP: REPORTS_SP,
	matchDates: utils.matchDates,
	MST_STATUS_LIST: MST_STATUS_LIST,
	PDF: PDF,
	getShortDate: utils.getDateString,
	formatDate: utils.formatDate,
	isValid: utils.isValid,
	sharePointDownload: utils.sharePointDownload,
	MST_LANG_ID: MST_LANG_ID,
	MILLISEC_PER_DAY: _MS_PER_DAY,
	THAI_IN_MILLISEC_PER_HOUR: THAI_IN_MILLISEC_PER_HOUR,
	PAYMENT_REDIRECT_ID: PAYMENT_REDIRECT_ID
};