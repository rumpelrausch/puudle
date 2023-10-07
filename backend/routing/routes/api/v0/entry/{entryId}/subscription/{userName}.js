const express = require("express");
const subscriptionController = require('../../../../../../../controller/subscriptionController');

/**
 * @param {express.Application} app 
 */
module.exports = (app, route, invokeController) => {
    app.route(route)
        .post(async (req, res, next) => {
            const subscriptionData = {
                entryId: req.params.entryId,
                userName: req.params.userName,
                ...req.body
            };
            invokeController(subscriptionController.addSubscription, subscriptionData, res, next);
        })
        .patch(async (req, res, next) => {
            const subscriptionData = {
                entryId: req.params.entryId,
                userName: req.params.userName,
                ...req.body
            };
            invokeController(subscriptionController.updateSubscription, subscriptionData, res, next);
        })
        .delete(async (req, res, next) => {
            const subscriptionData = {
                entryId: req.params.entryId,
                userName: req.params.userName
            };
            invokeController(subscriptionController.deleteSubscription, subscriptionData, res, next);
       });
};
