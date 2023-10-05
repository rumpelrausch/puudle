const path = require('path');
const fg = require('fast-glob');

const load = (app) => {
  for (let file of (fg.globSync('**/*.js', { cwd: path.join(__dirname, 'routes') }))) {
    const baseRoute = '/' + file.replace(/{([^\}]+)}/g, ':$1').slice(0, -3);
    const addRoutes = require('./routes/' + file);
    if (typeof addRoutes !== 'function') {
      return;
    }
    addRoutes(app, baseRoute);
  }
};

module.exports = { load };
