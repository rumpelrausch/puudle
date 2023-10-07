const express = require("express");
const entryController = require('../../../../../controller/entryController');
const { callController } = require('../../../../routeController');

/**
 * @param {express.Application} app 
 */
module.exports = (app, route) => {
    app.route(route)
        .get(async (req, res, next) => {
            callController(entryController.getEntry, req.params.entryId, res, next);
        })
        .patch(async (req, res, next) => {
            const entryData = {
                _id: req.params.entryId,
                ...req.body
            };
            callController(entryController.updateEntry, entryData, res, next);
        })
        .delete(async (req, res, next) => {
            callController(entryController.deleteEntry, req.params.entryId, res, next);
        });
};
