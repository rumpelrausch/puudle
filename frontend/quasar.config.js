/* eslint-env node */
/* eslint func-names: 0 */
/* eslint global-require: 0 */

const { configure } = require('quasar/wrappers');
const DotEnv = require('dotenv');

module.exports = configure((/* ctx */) => ({
  eslint: {
    // fix: true,
    // include: [],
    // exclude: [],
    // rawOptions: {},
    warnings: true,
    errors: true,
  },

  boot: [
    'i18n'
  ],

  css: [
    'app.css',
  ],

  extras: [
    'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
    'material-icons',
    'bootstrap-icons'
  ],

  build: {
    target: {
      browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
      node: 'node16',
    },

    vueRouterMode: 'hash',
    distDir: '../dist',
  },

  devServer: {
    open: false,
    port: 8081,
  },

  framework: {
    config: {
      brand: {
        white: '#f7f7f7',
        back: '#eceff1',
        primary: '#607d8b',
        secondary: '#90a4ae',
        accent: '#0097a7',
        disabled: '#fafafa',

        dark: '#333333',
        'dark-page': '#383838',

        positive: '#81c784',
        negative: '#e57373',
        info: '#49b3e4',
        warning: '#ffb74d'
      },
      customEnv: DotEnv.config({ path: '../.env.customize' }).parsed,
    },

    plugins: [
      'Dialog'
    ],
  },

  animations: [],

  pwa: {
    workboxMode: 'generateSW', // or 'injectManifest'
    injectPwaMetaTags: true,
    swFilename: 'sw.js',
    manifestFilename: 'manifest.json',
    useCredentialsForManifestTag: false,
  },

}));
