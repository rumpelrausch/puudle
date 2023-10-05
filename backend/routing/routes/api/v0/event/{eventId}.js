module.exports = (app, route) => {
    app.route(route)
        .patch(async (req, res) => {
            res.send(`PATCH modify event ${req.params.eventId}`);
        })
        .delete(async (req, res) => {
            res.send(`DELETE event ${req.params.eventId}`);
        });
};
