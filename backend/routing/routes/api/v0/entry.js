const express = require("express");
const entryController = require('../../../../controller/entryController');
const { callController } = require('../../../routeController');

/**
 * @param {express.Application} app 
 */
module.exports = (app, route) => {
    app.route(route)
        .get(async (req, res, next) => {
            callController(entryController.getEntryList, undefined, res, next);
        })
        .post(async (req, res, next) => {
            callController(entryController.addEntry, req.body, res, next);
        }); 
};
