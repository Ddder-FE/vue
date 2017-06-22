/**
 * Created by zhiyuan.huang@rdder.com on 17/6/22.
 */

'use strict'

import { isUndef, cached } from 'shared/util'

import updateClass from './class'
import updateStyle from './style'

function setStyle (elm, name, val) {
  if (!elm) return
  if (!name) return

  if ({}.toString.apply(name) === '[object Object]') {
    for (const type in name) {
      setStyle(elm, type, name[type])
    }
    return
  }

  elm.setStyle(normalizeName(name) + ':' + val)
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

function updateStyleSheet (oldVnode, vnode) {
  const el = vnode.elm
  const newClassString = updateClass(oldVnode, vnode)
  const newStyle = updateStyle(oldVnode, vnode)

  if (!newClassString && !newStyle) return

  const context = vnode.context
  const StyleSheet = context.constructor.StyleSheet

  if (!StyleSheet) return setStyle(el, newStyle)

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

  for (const name in prevStyleSheet) {
    if (isUndef(newStyleSheet[name]) && prevStyleSheet[name]) {
      prevStyleSheet[name] = ''
      setStyle(el, name, '')
    }
  }

  for (const name in newStyleSheet) {
    const cur = newStyleSheet[name]
    if (cur !== prevStyleSheet[name]) {
      const newVal = cur == null ? '' : cur

      prevStyleSheet[name] = newVal
      setStyle(el, name, newVal)
    }
  }
}

export default {
  create: updateStyleSheet,
  update: updateStyleSheet
}
