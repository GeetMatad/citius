'use strict';

const routerService = require('../services/routerService');

module.exports = function(app) {
    app.route('/weekdays/:weekdayId').get(routerService.getWeekdays)
    app.route('/login').post(routerService.login);
};

