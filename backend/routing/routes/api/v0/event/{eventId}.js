const express = require("express");
const eventController = require('../../../../../controller/eventController');
const { callController } = require('../../../../routeController');

/**
 * @param {express.Application} app 
 */
module.exports = (app, route) => {
    app.route(route)
        .get(async (req, res, next) => {
            callController(eventController.getEvent, req.params.eventId, res, next);
        })
        .patch(async (req, res, next) => {
            const eventData = {
                _id: req.params.eventId,
                ...req.body
            };
            callController(eventController.updateEvent, eventData, res, next);
        })
        .delete(async (req, res, next) => {
            callController(eventController.deleteEvent, req.params.eventId, res, next);
        });
};
