const path = require('path');
const fg = require('fast-glob');

const invokeController = (controllerFunction, data, res, next) => {
  controllerFunction(data)
      .then((result) => res.send(result))
      .catch((error) => {
          const statusCode = error.code >=100 ? error.code : 500;
          res.status(statusCode);
          res.send({ error: error.message });
          next();
      });
};

const load = (app) => {
  for (let file of (fg.globSync('**/*.js', { cwd: path.join(__dirname, 'routes') }))) {
    const baseRoute = '/' + file.replace(/{([^\}]+)}/g, ':$1').slice(0, -3);
    const addRoutes = require('./routes/' + file);
    if (typeof addRoutes !== 'function') {
      return;
    }
    addRoutes(app, baseRoute, invokeController);
  }
};

module.exports = { load };
