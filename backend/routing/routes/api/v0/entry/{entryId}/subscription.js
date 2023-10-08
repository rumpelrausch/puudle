const express = require("express");
const subscriptionController = require('../../../../../../controller/subscriptionController');

/**
 * @param {express.Application} app 
 */
module.exports = (app, route, invokeController) => {
    app.route(route)
        .post(async (req, res, next) => {
            const subscriptionData = {
                entryId: req.params.entryId,
                ...req.body
            };
            invokeController(subscriptionController.addSubscription, subscriptionData, res, next);
        });
};
