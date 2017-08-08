/**
 * @flow
 * Created by zhiyuan.huang@rdder.com on 17/6/28.
 */

/* global renderer */

'use strict'

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

import { warn, extend } from 'core/util/index'
import { transitionProps, extractTransitionData } from 'web/runtime/components/transition'
import { resolveClassValue, normalizeTransitionProperties } from '../modules/transition'

const NodePositionType = {
  STATIC: 0,
  ABSOLUTE: 1,
  FIXED: 2
}

const props = extend({
  tag: String,
  moveClass: String
}, transitionProps)

delete props.mode

export default {
  props,

  render (h: Function) {
    const tag: string = this.tag || this.$vnode.data.tag || 'div'
    const map: Object = Object.create(null)
    const prevChildren: Array<VNode> = this.prevChildren = this.children
    const rawChildren: Array<VNode> = this.$slots.default || []
    const children: Array<VNode> = this.children = []
    const transitionData: Object = extractTransitionData(this)

    for (let i = 0; i < rawChildren.length; i++) {
      const c: VNode = rawChildren[i]
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c)
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData
        } else if (process.env.NODE_ENV !== 'production') {
          const opts: ?VNodeComponentOptions = c.componentOptions
          const name: string = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag
          warn(`<transition-group> children must be keyed: <${name}>`)
        }
      }
    }

    if (prevChildren) {
      const kept: Array<VNode> = []
      const removed: Array<VNode> = []
      for (let i = 0; i < prevChildren.length; i++) {
        const c: VNode = prevChildren[i]
        c.data.transition = transitionData
        c.data.pos = c.elm.getBoundingClientRect()
        if (map[c.key]) {
          kept.push(c)
        } else {
          removed.push(c)
        }
      }
      this.kept = h(tag, null, kept)
      this.removed = removed
    }

    return h(tag, null, children)
  },

  beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    )
    this._vnode = this.kept
  },

  updated () {
    const children: Array<VNode> = this.prevChildren
    const moveClass: string = this.moveClass || ((this.name || 'v') + '-move')
    const moveData = children.length && this.getMoveData(children[0].context, moveClass)
    if (!moveData) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs)
    children.forEach(recordPosition)
    children.forEach(judgeMovable)

    children.forEach((c: VNode) => {
      if (c.data.movable) {
        const el: any = c.elm
        let oriPosition

        if (el.position === NodePositionType.STATIC) {
          oriPosition = NodePositionType.STATIC
          el.setStyle('position: fixed')
        }

        const moveAnimation = applyAnimation(el, c.data.pos, c.data.newPos, moveData, el._moveCb = function cb (e) {
          if (!e) {
            moveAnimation && moveAnimation.stop()
          }

          if (oriPosition !== undefined) {
            el.setStyle('position: static')
          }
        })
      }
    })
  },

  methods: {
    getMoveData (context, moveClass) {
      return normalizeTransitionProperties(resolveClassValue(context, moveClass))
    }
  }
}

function callPendingCbs (c: VNode) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb()
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb()
  }
}

function recordPosition (c: VNode) {
  c.data.newPos = c.elm.getBoundingClientRect()
}

function applyAnimation (el, startPos, endPos, animationProperties, cb) {
  if (!startPos || !endPos) return cb()

  return new renderer.Anime(el, {
    x: [startPos.left, endPos.left],
    y: [startPos.top, endPos.top]
  }, animationProperties).onComplete(cb).play()
}

function judgeMovable (c: VNode) {
  const oldPos = c.data.pos
  const newPos = c.data.newPos
  const dx = oldPos.left - newPos.left
  const dy = oldPos.top - newPos.top
  if (dx || dy) {
    c.data.movable = true
  }
}

