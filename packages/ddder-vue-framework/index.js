'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Created by zhiyuan.huang@rdder.com on 17/6/5.
 */

'use strict';

var VueFactory = require('./factory.js').VueFactory;

var instances = {};
var components = {};
var modules = {};

var renderer = {
  instances: instances,
  modules: modules,
  components: components
};

var version = '2.5.0-ddder.20';

function init (cfg) {
  renderer.Document = cfg.Document;
  renderer.Element = cfg.Element;
  renderer.Anime = cfg.Anime;
}

function reset () {
  clear(instances);
  clear(modules);
  clear(components);
  delete renderer.Document;
  delete renderer.Element;
  delete renderer.Comment;
}

function clear (obj) {
  for (var key in obj) {
    delete obj[key];
  }
}

/**
 * Create an instance with id, code, config and external data.
 * @param {string} instanceId
 * @param {string} appCode
 * @param {object} config
 * @param {object} data
 * @param {object} env { info, config, services }
 */
function createInstance (
  instanceId,
  appCode,
  config,
  data,
  env,
  parentInstanceId
) {
  if ( appCode === void 0 ) appCode = '';
  if ( config === void 0 ) config = {};
  if ( env === void 0 ) env = {};

  // Virtual-DOM object.
  var document = new renderer.Document(instanceId);

  var instance = instances[instanceId] = { instanceId: instanceId, config: config, data: data, document: document, parentInstanceId: parentInstanceId };

  var ddderInstanceVar = {
    config: config,
    document: document,
    env: env
  };

  Object.freeze(ddderInstanceVar);

  // Each instance has a independent `Vue` module instance
  var Vue = instance.Vue = createVueModuleInstance(instanceId);

  // The function which create a closure the JS Bundle will run in.
  // It will declare some instance variables like `Vue`, HTML5 Timer APIs etc.
  var instanceVars = Object.assign({
    Vue: Vue,
    ddder: ddderInstanceVar
  });

  // todo: ddder 暂时没有 bundle 为一个文件，所以，应该不是以string 类型的appCode 来作为入口调用的
  // callFunction(instanceVars, appCode)

  return instanceVars
}

/**
 * Destroy an instance with id. It will make sure all memory of
 * this instance released and no more leaks.
 * @param {string} instanceId
 */
function destroyInstance (instanceId) {
  var instance = instances[instanceId];

  if (instance && instance.app instanceof instance.Vue) {
    instance.app.$destroy();
  }

  delete instances[instanceId];
}

/**
 * Refresh an instance with id and new top-level component data.
 * It will use `Vue.set` on all keys of the new data. So it's better
 * define all possible meaningful keys when instance created.
 * @param {string} instanceId
 * @param {object} data
 */
function refreshInstance (instanceId, data) {
  var instance = instances[instanceId];

  if (!instance || !(instance.app instanceof instance.Vue)) {
    return new Error(("refreshInstance: instance " + instanceId + " not found!"))
  }

  for (var key in data) {
    instance.Vue.set(instance.app, key, data[key]);
  }
}

/**
 * Get the JSON object of the root element.
 * @param {string} instanceId
 */
function getRoot (instanceId) {
  var instance = instances[instanceId];
  if (!instance || !(instance.app instanceof instance.Vue)) {
    return new Error(("getRoot: instance " + instanceId + " not found!"))
  }
  return instance.app.$el.toJSON()
}

/**
 * Register native components information.
 * @param {array} newComponents
 */
function registerComponents (newComponents) {
  if (Array.isArray(newComponents)) {
    newComponents.forEach(function (component) {
      if (!component) { return }

      if (typeof component === 'string') {
        components[component] = true;
      } else if (typeof component === 'object' && typeof component.type === 'string') {
        components[component.type] = component;
      }
    });
  }
}

/**
 * Create a fresh instance of Vue for each Weex instance.
 */
function createVueModuleInstance (instanceId) {
  var instance = instances[instanceId];
  var parentInstance = instance.parentInstanceId && instances[instance.parentInstanceId];

  var Vue;

  if (parentInstance && parentInstance.document.Vue) {
    var SuperVue = parentInstance.document.Vue;
    Vue = SuperVue.extend();
  } else {
    var exports = {};
    VueFactory(exports, renderer);
    Vue = exports.Vue;
  }

  Vue.version = version;

  // patch reserved tag detection to account for dynamically registered
  // components
  var isReservedTag = Vue.config.isReservedTag || (function () { return false; });
  Vue.config.isReservedTag = function (name) {
    return components[name] || isReservedTag(name)
  };

  // expose ddder-specific info
  instance.document.Vue = Vue;
  Vue.document = instance.document;

  Vue.prototype.$instanceId = instanceId;
  Vue.prototype.$document = instance.document;

  // Hack `Vue` behavior to handle instance information and data
  // before root component created.
  Vue.mixin({
    beforeCreate: function beforeCreate () {
      var options = this.$options;

      // root component (vm)
      if (options.el) {
        // set external data of instance
        var dataOption = options.data;
        var internalData = (typeof dataOption === 'function' ? dataOption() : dataOption) || {};
        options.data = Object.assign(internalData, instance.data);

        // record instance by id
        instance.app = this;
      }
    }
  });

  return Vue
}

exports.version = version;
exports.init = init;
exports.reset = reset;
exports.createInstance = createInstance;
exports.destroyInstance = destroyInstance;
exports.refreshInstance = refreshInstance;
exports.getRoot = getRoot;
exports.registerComponents = registerComponents;
