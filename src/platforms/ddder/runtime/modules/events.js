/* @flow */

import { isDef, isUndef } from 'shared/util'
import { updateListeners } from 'core/vdom/helpers/index'

function normalizeEvents (on) {}

let target: HTMLElement

function add (
  event: string,
  handler: Function,
  once: boolean,
  capture: boolean,
  passive: boolean
) {
  if (once) {
    const oldHandler = handler
    const _target = target // save current target element in closure
    handler = function (ev) {
      const res = arguments.length === 1
        ? oldHandler(ev)
        : oldHandler.apply(null, arguments)
      if (res !== null) {
        remove(event, handler, capture, _target)
      }
    }
  }
  target.addEventListener(
    event,
    handler,
    capture
  )
}

function remove (
  event: string,
  handler: Function,
  capture: boolean,
  _target?: HTMLElement
) {
  (_target || target).removeEventListener(event, handler, capture)
}

function updateDOMListeners (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  const isComponentRoot = isDef(vnode.componentOptions)
  let oldOn = isComponentRoot ? oldVnode.data.nativeOn : oldVnode.data.on
  let on = isComponentRoot ? vnode.data.nativeOn : vnode.data.on

  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }

  on = on || {}
  oldOn = oldOn || {}
  target = vnode.elm
  normalizeEvents(on)
  updateListeners(on, oldOn, add, remove, vnode.context)
}

export default {
  create: updateDOMListeners,
  update: updateDOMListeners
}
