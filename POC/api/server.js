'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require("./config/environmental.json");
const responseService= require('./utility/responseService');

const port = 9000;
const app = express();


// parser requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parser resquests of content-type application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
    let host = req.headers.origin;
    if (host === undefined) {
        host = req.headers.host;
    }
    if (req.headers.referer === undefined) {
        req.headers.referer = host;
    }
    if ('OPTIONS' === req.method) {
            res.sendStatus(200);
        } else {
            next();
        }
});
const routes = require('./app/routes/router');
routes(app);


//This code is for responding for unknown route handing.
app.use((req, res) => {
    responseService.validateAndSend(null, null, req, res,
        responseService.getGeneralErrorMessages(null).Bad_Request);
});

// listen for resquests
app.listen(port, () => {
    console.log('server is running on port ' + port);
});