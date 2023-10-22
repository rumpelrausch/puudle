const express = require("express");
const entryController = require('../../../../controller/entryController');

/**
 * @param {express.Application} app 
 */
module.exports = (app, route, invokeController) => {
    app.route(route)
        .get(async (req, res, next) => {
            invokeController(entryController.getEntryList, req.query, res, next);
        })
        .post(async (req, res, next) => {
            invokeController(entryController.addEntry, req.body, res, next);
        }); 
};
