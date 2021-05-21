'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    babel: {
      // don't transpile generator functions
      exclude: [
        'transform-regenerator',
      ]
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    compatAdapters: new Map([
      ['ember-get-config', EmberGetConf]
    ])
  });
};

const V1Addon = require('@embroider/compat/src/v1-addon');
const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');

function createIndexContents(config) {
  return `export default ${JSON.stringify(config)};`;
}

class EmberGetConf extends V1Addon.default {
  get v2Tree() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const configModule = require(this.app.configPath());
    const appEnvironmentConfig = configModule(this.app.env);

    return mergeTrees([super.v2Tree, writeFile('index.js', createIndexContents(appEnvironmentConfig))], { overwrite: true });
  }
}