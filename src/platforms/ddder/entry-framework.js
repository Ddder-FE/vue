/**
 * Created by zhiyuan.huang@rdder.com on 17/6/5.
 */

'use strict';

// todo: need to build vue into an factory function like weex-vue build script
const VueFactory = require('./factory')

const instances = {}
const components = {}

const renderer = {
  instances,
  modules,
  components
}

export function init (cfg) {
  renderer.Document = cfg.Document
  renderer.Element = cfg.Element
  renderer.Comment = cfg.Comment
}

export function reset() {
  clear(instances)
  clear(modules)
  clear(components)
  delete renderer.Document
  delete renderer.Element
  delete renderer.Comment
}

function clear(obj) {
  for (const key in obj) {
    delete obj[key]
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
export function createInstance (
  instanceId,
  appCode = '',
  config = {},
  data,
  env = {}
) {
  // Virtual-DOM object.
  // todo: what equal to weex document in ddder
  const document = new renderer.Document(instanceId)

  const instance = instances[instanceId] = { instanceId, config, data, document }

  const ddderInstanceVar = {
    config,
    document,
    env
  }

  Object.freeze(ddderInstanceVar)

  // Each instance has a independent `Vue` module instance
  const Vue = instance.Vue = createVueModuleInstance(instanceId)

  // The function which create a closure the JS Bundle will run in.
  // It will declare some instance variables like `Vue`, HTML5 Timer APIs etc.
  const instanceVars = Object.assign({
    Vue,
    ddder: ddderInstanceVar
  })

  // todo: ddder 暂时没有 bundle 为一个文件，所以，应该不是以string 类型的appCode 来作为入口调用的
  // callFunction(instanceVars, appCode)

  return instanceVars
}

/**
 * Destroy an instance with id. It will make sure all memory of
 * this instance released and no more leaks.
 * @param {string} instanceId
 */
export function destroyInstance (instanceId) {
  const instance = instances[instanceId]

  if (instance && instance.app instanceof instance.Vue) {
    instance.app.$destroy()
  }

  delete instances[instanceId]
}

/**
 * Refresh an instance with id and new top-level component data.
 * It will use `Vue.set` on all keys of the new data. So it's better
 * define all possible meaningful keys when instance created.
 * @param {string} instanceId
 * @param {object} data
 */
export function refreshInstance (instanceId, data) {
  const instance = instances[instanceId]

  if (!instance || !(instance.app instanceof instance.Vue)) {
    return new Error(`refreshInstance: instance ${instanceId} not found!`)
  }

  for (const key in data) {
    instance.Vue.set(instance.app, key, data[key])
  }
}

/**
 * Get the JSON object of the root element.
 * @param {string} instanceId
 */
export function getRoot (instanceId) {
  const instance = instances[instanceId]
  if (!instance || !(instance.app instanceof instance.Vue)) {
    return new Error(`getRoot: instance ${instanceId} not found!`)
  }
  return instance.app.$el.toJSON()
}

/**
 * Register native components information.
 * @param {array} newComponents
 */
export function registerComponents (newComponents) {
  if (Array.isArray(newComponents)) {
    newComponents.forEach(component => {
      if (!component) return

      if (typeof component === 'string') {
        components[component] = true
      } else if (typeof component === 'object' && typeof component.type === 'string') {
        components[component.type] = component
      }
    })
  }
}

/**
 * Create a fresh instance of Vue for each Weex instance.
 */
function createVueModuleInstance (instanceId) {
  const exports = {}
  VueFactory(exports, renderer)
  const Vue = exports.Vue

  const instance = instances[instanceId]

  // patch reserved tag detection to account for dynamically registered
  // components
  const isReservedTag = Vue.config.isReservedTag || (() => false)
  Vue.config.isReservedTag = name => {
    return components[name] || isReservedTag(name)
  }

  // expose ddder-specific info
  Vue.prototype.$instanceId = instanceId
  Vue.prototype.$document = instance.document

  // Hack `Vue` behavior to handle instance information and data
  // before root component created.
  Vue.mixin({
    beforeCreate () {
      const options = this.$options

      // root component (vm)
      if (options.el) {
        // set external data of instance
        const dataOption = options.data
        const internalData = (typeof dataOption === 'function' ? dataOption() : dataOption) || {}
        options.data = Object.assign(internalData, instance.data)

        // record instance by id
        instance.app = this
      }
    }
  })

  return Vue
}

/**
 * Call a new function body with some global objects.
 * @param  {object} globalObjects
 * @param  {string} code
 * @return {any}
 */
function callFunction (globalObjects, body) {
  const globalKeys = []
  const globalValues = []

  for (const key in globalObjects) {
    globalKeys.push(key)
    globalValues.push(globalObjects[key])
  }
  globalKeys.push(body)

  const result = new Function(...globalKeys)
  return result(...globalValues)
}
