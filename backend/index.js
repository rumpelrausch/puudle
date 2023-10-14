const express = require("express");
const serveStatic = require('serve-static');
const routeLoader = require('./routing/routeLoader.js');
const db = require('./services/db.js');

db.persistDays(30);

const app = express();
app.use(serveStatic('dist'));
app.use(express.json());
routeLoader.load(app);
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`API is listening on port ${port}`);
});
