const express = require("express");
const entryController = require('../../../../../controller/entryController');


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
            invokeController(entryController.updateEntry, entryData, res, next);
        })
        .delete(async (req, res, next) => {
            invokeController(entryController.deleteEntry, req.params.entryId, res, next);
        });
};
