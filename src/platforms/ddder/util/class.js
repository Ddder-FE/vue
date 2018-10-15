/* @flow */

import { isDef, isObject } from 'shared/util'

import { isNativeSupportNStyleSheet } from 'ddder/util/isNStyleSheetSupport';
import { getComponentNStyleSheetScope } from 'ddder/util/getComponentNStyleSheetScope';

export function getStyleSheetNameSpaceForVnode(vnode: VNode): string {
  let namespace = '';

  if (vnode.data && vnode.data['classScopeId']) {
    namespace = vnode.data.classScopeId;
  } else if (vnode.context && vnode.context.$options) {
    namespace = getComponentNStyleSheetScope(vnode.context);
  }

  return namespace;
}

export function genClassForVnode (vnode: VNode): string {
  let data = vnode.data
  let parentNode = vnode
  let childNode = vnode

  let classString = renderClass(data.staticClass, data.class, getStyleSheetNameSpaceForVnode(vnode))

  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode
    if (childNode.data) {
      classString = concat(renderClass(childNode.data.staticClass, childNode.data.class, getStyleSheetNameSpaceForVnode(childNode)), classString)
      data = mergeClassData(childNode.data, data)
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      classString = concat(classString, renderClass(parentNode.data.staticClass, parentNode.data.class, getStyleSheetNameSpaceForVnode(parentNode)))
      data = mergeClassData(data, parentNode.data)
    }
  }

  return classString
}

function mergeClassData (child: VNodeData, parent: VNodeData): {
  staticClass: string,
  class: any
} {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

export function renderClass (
  staticClass: ?string,
  dynamicClass: any,
  classScope: ?string
): string {
  let result = '';

  if (isDef(staticClass) || isDef(dynamicClass)) {
    result = concat(staticClass, stringifyClass(dynamicClass))
  }

  if (isNativeSupportNStyleSheet && classScope) {
    result = result.split(' ').reduce((result, item) => {
      item && result.push(item + '_' + classScope);
      return result;
    }, []).join(' ');
  }

  return result;
}

export function concat (a: ?string, b: ?string): string {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

export function stringifyClass (value: any): string {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value: Array<any>): string {
  let res = ''
  let stringified
  for (let i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) res += ' '
      res += stringified
    }
  }
  return res
}

function stringifyObject (value: Object): string {
  let res = ''
  for (const key in value) {
    if (value[key]) {
      if (res) res += ' '
      res += key
    }
  }
  return res
}
