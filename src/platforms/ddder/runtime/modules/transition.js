/**
 * @flow
 * Created by zhiyuan.huang@rdder.com on 17/6/28.
 */

'use strict'

import { warn } from 'core/util/debug'
import { extend, once, noop, isPlainObject } from 'shared/util'
import { mergeVNodeHook } from 'core/vdom/helpers/index'
import { activeInstance } from 'core/instance/lifecycle'
import { resolveTransition } from 'web/runtime/transition-util'

import { setStyle } from './stylesheet'

let animationUid = 0

export function generateAnimationName () {
  return '__animation_' + ++animationUid + '__'
}

export function enter (vnode, toggleDisplay: ?() => void) {
  const el = vnode.elm

  // call leave callback now
  if (el._leaveCb) {
    el._leaveCb.cancelled = true
    el._leaveCb()
  }

  const data = resolveTransition(vnode.data.transition)
  if (!data) {
    return
  }

  if (el._enterCb) {
    return
  }

  const {
    enterClass,
    enterToClass,
    enterActiveClass,
    appearClass,
    appearToClass,
    appearActiveClass,
    beforeEnter,
    enter,
    afterEnter,
    enterCancelled,
    beforeAppear,
    appear,
    afterAppear,
    appearCancelled
  } = data

  let context = activeInstance
  let transitionNode = activeInstance.$vnode
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent
    context = transitionNode.context
  }

  const isAppear = !context._isMounted || !vnode.isRootInsert

  // which means transition default apply to vnode
  // when status change between enter and remove.
  // Initial appear render do not have transition
  if (isAppear && !appear && appear !== '') {
    return
  }

  const startClass = isAppear && appearClass ? appearClass : enterClass
  const activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass
  const toClass = isAppear && appearToClass ? appearToClass : enterToClass

  const beforeEnterHook = isAppear ? (beforeAppear || beforeEnter) : beforeEnter
  const enterHook = isAppear ? (typeof appear === 'function' ? appear : enter) : enter
  const afterEnterHook = isAppear ? (afterAppear || afterEnter) : afterEnter
  const enterCancelledHook = isAppear ? (appearCancelled || enterCancelled) : enterCancelled

  const userWantsControl = enterHook && (enterHook._length || enterHook.length) > 1

  const stylesheet = el._prevStyleSheet || {}
  const startState = resolveClassValue(vnode.context, startClass)
  const transitionProperties = normalizeTransitionProperties(resolveClassValue(vnode.context, activeClass))
  const endState = getEnterTargetState(el, stylesheet, startClass, toClass, activeClass, vnode.context)
  const needAnimation = Object.keys(endState).length > 0

  let animationName
  const cb = el._enterCb = once(() => {
    if (cb.cancelled) {
      if (animationName) {
        el.stopAnimation(animationName)
      }

      // el._prevStyleSheet = stylesheet
      setStyle(el, stylesheet)

      enterCancelledHook && enterCancelledHook(el)
    } else {
      // el._prevStyleSheet = Object.assign(stylesheet, startState, endState)
      afterEnterHook && afterEnterHook(el)
    }
    el._enterCb = null
  })

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', () => {
      const parent = el.parentNode
      const pendingNode = parent && parent._pending && parent._pending[vnode.key]
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb()
      }
      enterHook && enterHook(el, cb)
    })
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el)

  setTimeout(() => {
    if (!cb.cancelled && needAnimation) {
      animationName = generateNodeAnimation(el, endState, transitionProperties, userWantsControl ? noop : cb)
    } else if (!userWantsControl) {
      cb()
    }
  }, 16)

  if (startState) {
    // el._prevStyleSheet = Object.assign({}, stylesheet, startState)
    for (const key in startState) {
      setStyle(el, key, startState[key])
    }
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay()
    enterHook && enterHook(el, cb)
  }

  if (!needAnimation && !userWantsControl) {
    cb()
  }
}

export function leave (vnode, rm) {
  const el = vnode.elm

  // call enter callback now
  if (el._enterCb) {
    el._enterCb.cancelled = true
    el._enterCb()
  }

  const data = resolveTransition(vnode.data.transition)
  if (!data) {
    return rm()
  }

  if (el._leaveCb) {
    return
  }

  const {
    leaveClass,
    leaveToClass,
    leaveActiveClass,
    beforeLeave,
    leave,
    afterLeave,
    leaveCancelled,
    delayLeave
  } = data

  let context = vnode.context
  let transitionNode = context.$vnode
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent
    context = transitionNode.context
  }

  const userWantControl = leave && (leave._length || leave.length) > 1

  const stylesheet = el._prevStyleSheet || {}
  const startState = resolveClassValue(vnode.context, leaveClass)
  const transitionProperties = normalizeTransitionProperties(resolveClassValue(vnode.context, leaveActiveClass))
  const endState = resolveClassValue(vnode.context, leaveToClass) || resolveClassValue(vnode.context, leaveActiveClass)

  let leaveAnimationName
  const cb = el._leaveCb = once(() => {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null
    }
    if (cb.cancelled) {
      leaveAnimationName && el.stopAnimation(leaveAnimationName)

      // el._prevStyleSheet = stylesheet
      setStyle(el, stylesheet)

      leaveCancelled && leaveCancelled(el)
    } else {
      rm()
      // el._prevStyleSheet = Object.assign(stylesheet, startState, endState)
      afterLeave && afterLeave(el)
    }
    el._leaveCb = null
  })

  if (delayLeave) {
    delayLeave(performLeave)
  } else {
    performLeave()
  }

  function performLeave () {
    if (cb.cancelled) {
      return
    }

    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode
    }
    beforeLeave && beforeLeave(el)

    if (startState) {
      el._prevStyleSheet = Object.assign({}, stylesheet, startState)
      generateNodeAnimation(el, startState, {}, next)
    } else {
      next()
    }

    function next () {
      leaveAnimationName = generateNodeAnimation(
        el,
        endState,
        transitionProperties,
        userWantControl ? noop : cb
      )
    }

    leave && leave(el, cb)
    if (!endState && !userWantControl) {
      cb()
    }
  }
}

export function resolveClassValue (context, className) {
  const StyleSheet = context.StyleSheet

  if (!StyleSheet) {
    return {}
  }

  if (className.match(/^\d*$/)) {
    return StyleSheet.flatten(className)
  } else {
    let resolveStyleId = context.styleScope && context.styleScope[className]
    if (resolveStyleId == null) {
      context = context.$parent
      resolveStyleId = context && context.styleScope && context.styleScope[className]
    }
    return StyleSheet.processStyle(StyleSheet.flatten(resolveStyleId) || {})
  }
}

export function normalizeTransitionProperties (activeState) {
  if (!isPlainObject(activeState)) return {}

  const transition = activeState.transition

  if (isPlainObject(transition)) return transition

  // todo: string transition parser
  if (typeof transition === 'string') {
    return {}
  } else {
    return {}
  }
}

// determine the target animation style for an entering transition.
function getEnterTargetState (el, stylesheet, startClass, endClass, activeClass, context) {
  const targetState = {}

  const startState = resolveClassValue(context, startClass)
  const endState = resolveClassValue(context, endClass)
  const activeState = resolveClassValue(context, activeClass)

  if (startState) {
    for (const key in startState) {
      targetState[key] = stylesheet[key]

      if (
        process.env.NODE_ENV !== 'production' &&
        targetState[key] == null &&
        (!activeState || activeState[key] == null) &&
        (!endState || endState[key] == null)
      ) {
        warn(
          `transition property "${key}" is declared in enter starting class (.${startClass}), ` +
          `but not declared anywhere in enter ending class (.${endClass}), ` +
          `enter active cass (.${activeClass}) or the element's default styling. ` +
          `Note in Weex, CSS properties need explicit values to be transitionable.`
        )
      }
    }
  }

  if (activeState) {
    for (const key in activeState) {
      if (key.indexOf('transition') < 0) {
        targetState[key] = activeState[key]
      }
    }
  }

  if (endState) {
    extend(targetState, endState)
  }

  return targetState
}

export function generateNodeAnimation (el, styles, animationProperties, done = noop) {
  if (!styles) {
    done()
    return
  }

  const styleNames = Object.keys(styles)
  const styleLength = styleNames.length

  if (!styleLength) {
    done()
    return
  }

  const name = generateAnimationName()

  let completedStyleAnimation = 0

  function animationEndListener () {
    ++completedStyleAnimation
    if (completedStyleAnimation >= styleLength) done()
  }

  function addAnimation (styleName, styleVal, cb) {
    if (!styleName || styleVal === undefined) return cb()

    el.addAnimation(
      name,
      styleName,
      animationProperties.easing || 'linear',
      'current',
      styleVal,
      animationProperties.duration || 0,
      {
        beginTime: animationProperties.delay || 0,
        onfinished: (/* e */) => {
          cb()
        }
      }
    )
  }

  for (let i = 0; i < styleLength; ++i) {
    const styleName = styleNames[i]
    const styleValue = styles[styleName]

    if (styleName === 'backgroundColor' || styleName === 'background-color') {
      const rgbaArray = styleValue.match(/\((.*)\)/)[1].split(',').map(v => v ? v.trim() : undefined)

      let completedRgbaAnimation = 0
      const rgbaAnimationEndListener = () => {
        if (++completedRgbaAnimation >= 4) {
          animationEndListener()
        }
      }

      addAnimation('bkcolor-r', rgbaArray[0], rgbaAnimationEndListener)
      addAnimation('bkcolor-g', rgbaArray[1], rgbaAnimationEndListener)
      addAnimation('bkcolor-b', rgbaArray[2], rgbaAnimationEndListener)
      addAnimation('bkcolor-a', rgbaArray[3], rgbaAnimationEndListener)
    } else {
      addAnimation(styleName, styleValue, animationEndListener)
    }
  }

  el.startAnimation(name)
  return name
}

function _enter (_: any, vnode: VNodeWithData) {
  if (vnode.data.show !== true) {
    enter(vnode)
  }
}

export default {
  create: _enter,
  activate: _enter,
  remove: leave
}
