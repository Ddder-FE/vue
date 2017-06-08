/**
 * Created by zhiyuan.huang@rdder.com on 17/6/2.
 */

/* @flow */

'use strict';

import { warn } from 'core/util/index'

import Vue from './runtime/index'
import { compileToFunctions } from './compiler/index'

const idToTemplate = (id, instance: Component) => {
  if (!id) return

  if (id.indexOf('#') === 0) {
    id = id.slice(1)
  }

  if (!instance || !(instance instanceof Vue)) return

  let template

  if (!instance._xTemplateMaps || !(template = instance._xTemplateMaps[id])) {
    return idToTemplate(id, instance.$parent)
  }

  return template
}

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function(el, hydrating?: boolean): Component {
  if (el === Vue.$document) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to root document or body, try to mount to normal elements instead`
    )
    return this
  }

  const options = this.$options

  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template, this)
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template options:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterTemplate(el)
    }

    if (template) {
      const { render, staticRenderFns } = compileToFunctions(template, { delimiters: options.delimiters }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns
    }
  }

  return mount.call(this, el, hydrating)
}

function getOuterTemplate (el): string {
  // todo: convert ddder node to template string
  return ''
}

Vue.compile = compileToFunctions

exports.Vue = Vue
