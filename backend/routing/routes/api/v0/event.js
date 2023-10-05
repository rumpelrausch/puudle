const express = require("express");
const eventController = require('../../../../controller/eventController');
const { callController } = require('../../../routeController');

/**
 * @param {express.Application} app 
 */
module.exports = (app, route) => {
    app.route(route)
        .get(async (req, res, next) => {
            callController(eventController.getEventList, undefined, res, next);
        })
        .post(async (req, res, next) => {
            callController(eventController.addEvent, req.body, res, next);
        }); 
};
