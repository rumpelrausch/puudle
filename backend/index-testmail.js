const dotEnv = require('dotenv');
dotEnv.config({ path: '.env.customize' }).parsed || {};
dotEnv.config({ path: '.env' }).parsed || {};

const { notify } = require('./services/notifier.js');
notify(true);
