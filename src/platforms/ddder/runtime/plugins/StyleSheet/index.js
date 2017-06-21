/**
 *
 * Created by zhiyuan.huang@rdder.com on 17/6/21.
 */

'use strict';

import { addValidStylePropTypes, validateStyle } from './propValidator'
import * as registry from './registry'
import { addTypeProcessor, processStyle } from './propProcessor'

function getStyle(style) {
  if (typeof style === 'number') {
    return registry.getByID(style)
  }
  return style
}

function flatten(style) {
  if (!style) return undefined

  if (!Array.isArray(style)) {
    return getStyle(style)
  }

  const result = {}

  for (let i = 0; i < style.length; ++i) {
    const computedStyle = flatten(style[i])
    if (computedStyle) {
      for (const key in computedStyle) {
        result[key] = computedStyle[key]
      }
    }
  }

  return result
}

export function install(Vue) {

  Vue.StyleSheet = {
    addValidStylePropTypes,
    validateStyle,

    addTypeProcessor,
    processStyle,

    flatten,
    create: function(obj) {
      const result = {}

      for (const key in obj) {
        validateStyle(key, obj)
        result[key] = registry.register(obj[key])
      }

      return result
    }
  }

}
