const express = require("express");
const entryController = require('../../../../../controller/subscriptionController');

/**
 * @param {express.Application} app 
 */
module.exports = (app, route, invokeController) => {
    app.route(route)
        .patch(async (req, res, next) => {
            const entryData = {
                _id: req.params.entryId,
                ...req.body
            };
            invokeController(entryController.updateSubscription, entryData, res, next);
        })
};
