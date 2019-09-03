/*
const express = require('express');
const router = express.Router();
const loginService =require('../services/userService')


//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
// Define the home page route
router.get('/', function(req, res) {
    res.send('home page');
});
// Define the about route
router.post('/login', loginService.userLoginService);
module.exports = router;*/
'use strict';
const routerService = require('../services/routerService');
module.exports = function(app) {
    app.route('/weekdays/:weekdayId').get(routerService.getWeekdays)
    app.route('/login').post(routerService.login);
};

