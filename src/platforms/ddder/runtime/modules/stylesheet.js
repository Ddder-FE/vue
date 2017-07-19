/**
 * Created by zhiyuan.huang@rdder.com on 17/6/22.
 */

'use strict'

import { isUndef, cached } from 'shared/util'

import updateClass from './class'
import updateStyle from './style'

export function setStyle (elm, styleSheet) {
  if (!elm) return

  if (typeof styleSheet === 'string' && arguments[2] !== undefined) {
    elm.setStyle([normalizeName(styleSheet), arguments[2]].join(':'))
  } else {
    elm.setStyle(serializeStyleObj(styleSheet))
  }
}

const hyphenateRE = /([^-])([A-Z])/g
const hyphenate = cached(str => {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
})

function normalizeName (name) {
  return hyphenate(name)
}

function serializeStyleObj (styleSheet) {
  const propNames = Object.keys(styleSheet)
  const result = []

  for (let i = 0; i < propNames.length; ++i) {
    const propName = propNames[i]
    result.push(normalizeName(propName) + ':' + styleSheet[propName])
  }

  return result.join(';')
}

function updateStyleSheet (oldVnode, vnode) {
  const el = vnode.elm
  const newClassString = updateClass(oldVnode, vnode)
  const newStyle = updateStyle(oldVnode, vnode)

  if (!newClassString && !newStyle) return

  const context = vnode.context
  const StyleSheet = context.StyleSheet

  if (!StyleSheet) {
    // todo: should compare prevStyleSheet with newStyle, and patch style diff
    el._prevStyleSheet = newStyle
    return setStyle(el, newStyle)
  }

  const styleList = []

  if (newClassString) {
    const newClassSet = Array.from(new Set(newClassString.split(' ')).values())

    for (let i = 0; i < newClassSet.length; ++i) {
      const val = newClassSet[i]

      if (val.match(/^\d*$/)) {
        styleList.push(Number(val))
      } else {
        if (context.styleScope && context.styleScope[val]) styleList.push(context.styleScope[val])
      }
    }
  }

  if (newStyle) {
    styleList.push(newStyle)
  }

  const newStyleSheet = StyleSheet.flatten(styleList)
  const prevStyleSheet = el._prevStyleSheet || (el._prevStyleSheet = {})

  StyleSheet.processStyle(newStyleSheet)

  const newStyleSheetBuffer = new StyleBuffer(el)

  for (const name in prevStyleSheet) {
    if (isUndef(newStyleSheet[name]) && prevStyleSheet[name]) {
      prevStyleSheet[name] = ''
      newStyleSheetBuffer.add(name, '')
    }
  }

  for (const name in newStyleSheet) {
    const cur = newStyleSheet[name]
    if (cur !== prevStyleSheet[name]) {
      const newVal = cur == null ? '' : cur

      prevStyleSheet[name] = newVal
      newStyleSheetBuffer.add(name, newVal)
    }
  }

  setStyle.apply(el, newStyleSheetBuffer.end())
}

function StyleBuffer (el) {
  this.elm = el
  this.styleObj = {}
}

StyleBuffer.prototype.add = function (name, value = '') {
  this.styleObj[name] = value
}

StyleBuffer.prototype.end = function () {
  return [this.elm, this.styleObj]
}

export default {
  // ddder 底层对样式的处理是：新增的样式不会影响已添加元素的样式，
  // 而vue 中元素create 顺序是先childNodes 后parent，
  // 所以，要在precreate hook 中添加样式
  precreate: updateStyleSheet,
  update: updateStyleSheet
}
