module.exports = (app, route) => {
    app.route(route)
        .get(async (req, res) => {
            res.send(`GET list of all events`);
        })
        .post(async (req, res) => {
            res.send(`POST a new event`);
        });
};
