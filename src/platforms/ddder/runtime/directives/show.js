/**
 * @flow
 * Created by zhiyuan.huang@ddder.net on 17/6/29.
 */

'use strict'

import { enter, leave } from '../modules/transition'

// recursively search for possible transition defined inside the component root
function locateNode (vnode: VNode): VNodeWithData {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

function setElementDisplay (el: any, display: string) {
  if (!display) display = 'none'

  if (display === 'none') {
    el.visible = false
  } else {
    if (!el.visible) el.visible = true
    el.setStyle('display:' + display)
  }
}

function getElementDisplay (el:any) {
  if (!el.visible) return 'none'
  return el.display ? 'inline' : 'block'
}

export default {
  bind (el: any, { value }: VNodeDirective, vnode: VNodeWithData) {
    vnode = locateNode(vnode)
    const transition = vnode.data && vnode.data.transition
    const originalDisplay = el.__vOriginalDisplay = getElementDisplay(el)

    if (value && transition) {
      vnode.data.show = true
      enter(vnode, () => {
        setElementDisplay(el, originalDisplay)
      })
    } else {
      setElementDisplay(el, originalDisplay)
    }
  },

  update (el: any, { value, oldValue }: VNodeDirective, vnode: VNodeWithData) {
    /* istanbul ignore if */
    if (value === oldValue) return
    vnode = locateNode(vnode)
    const transition = vnode.data && vnode.data.transition
    if (transition) {
      vnode.data.show = true
      if (value) {
        enter(vnode, () => {
          setElementDisplay(el, el.__vOriginalDisplay)
        })
      } else {
        leave(vnode, () => {
          setElementDisplay('none')
        })
      }
    } else {
      setElementDisplay(el, value ? el.__vOriginalDisplay : 'none')
    }
  },

  unbind (
    el: any,
    binding: VNodeDirective,
    vnode: VNodeWithData,
    oldVnode: VNodeWithData,
    isDestroy: boolean
  ) {
    if (!isDestroy) {
      setElementDisplay(el, el.__vOriginalDisplay)
    }
  }
}

