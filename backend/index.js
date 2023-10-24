const express = require("express");
const cors = require('cors');
const serveStatic = require('serve-static');
const routeLoader = require('./routing/routeLoader.js');
const db = require('./services/db.js');
const dotEnv = require('dotenv');
dotEnv.config({ path: '.env.customize' }).parsed || {};
dotEnv.config({ path: '.env' }).parsed || {};

db.persistDays(process.env.DB_PERSIST_DAYS);

const app = express();
app.use(cors());
app.use(serveStatic('dist'));
app.use(express.json());
routeLoader.load(app);
const port = process.env.BACKEND_PORT;
app.listen(port, () => {
    console.log(`API is listening on port ${port}`);
});
