/**
 * Created by zhiyuan.huang@rdder.com on 17/6/22.
 */

/* global HTMLElement */

'use strict'

import Vue from 'vue'
import VNode from 'core/vdom/vnode'

import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'
import styleSheet from 'ddder/runtime/modules/stylesheet'
import StyleSheetPlugin from 'ddder/runtime/plugins/StyleSheet'

const modules = platformModules.concat(baseModules, styleSheet)

const patch = createPatchFunction({ nodeOps, modules })

describe('vdom StyleSheet module', () => {
  let oriSetStyle

  beforeAll(() => {
    Vue.use(StyleSheetPlugin)

    oriSetStyle = HTMLElement.prototype.setStyle
    HTMLElement.prototype.setStyle = function (styleString) {
      const [type, val] = styleString.split(':')

      if (!this._mock_style_) this._mock_style_ = {}
      this._mock_style_[type] = val
    }
  })

  afterAll(() => {
    if (oriSetStyle) HTMLElement.prototype.setStyle = oriSetStyle
  })

  describe('style module', () => {
    it('should create an element with style', () => {
      const vnode = new VNode('p', { style: { fontSize: '12px' }})
      vnode.context = new Vue()

      const elm = patch(null, vnode)
      expect(elm._mock_style_['font-size']).toBe('12px')
    })

    it('should create an element with array style', () => {
      const vnode = new VNode('p', { style: [{ fontSize: '12px' }, { color: 'red' }] })
      vnode.context = new Vue()

      const elm = patch(null, vnode)
      expect(elm._mock_style_['font-size']).toBe('12px')
      expect(elm._mock_style_.color).toBe('rgba(255, 0, 0, 1)')
    })

    it('should change elements style', () => {
      const vnode1 = new VNode('p', { style: { fontSize: '12px' }})
      vnode1.context = new Vue()

      const vnode2 = new VNode('p', { style: { fontSize: '10px', display: 'block' }})
      vnode2.context = new Vue()

      patch(null, vnode1)
      const elm = patch(vnode1, vnode2)
      expect(elm._mock_style_['font-size']).toBe('10px')
      expect(elm._mock_style_.display).toBe('block')
    })

    it('should remove elements attrs', () => {
      const vnode1 = new VNode('p', { style: { fontSize: '12px' }})
      vnode1.context = new Vue()

      const vnode2 = new VNode('p', { style: { display: 'block' }})
      vnode2.context = new Vue()

      patch(null, vnode1)
      const elm = patch(vnode1, vnode2)
      expect(elm._mock_style_['font-size']).toBe('')
      expect(elm._mock_style_.display).toBe('block')
    })
  })

  describe('class module', () => {
    let style
    let scopeInstance
    let emptyInstance

    function rectTestCase (elm) {
      expect(elm._mock_style_.height).toBe('100')
      expect(elm._mock_style_.width).toBe('100')
    }

    function rectNullTestCase (elm) {
      expect(elm._mock_style_.height).toBeUndefined()
      expect(elm._mock_style_.width).toBeUndefined()
    }

    function positionTestCase (elm) {
      expect(elm._mock_style_.top).toBe('0')
      expect(elm._mock_style_.left).toBe('0')
    }

    function positionNullTestCase (elm) {   // eslint-disable-line no-unused-vars
      expect(elm._mock_style_.top).toBeUndefined()
      expect(elm._mock_style_.left).toBeUndefined()
    }

    beforeAll(() => {
      style = Vue.StyleSheet.create({
        rect: {
          width: 100,
          height: 100
        },
        position: {
          left: 0,
          top: 0
        }
      })

      scopeInstance = new Vue({
        data: {
          styleScope: style
        }
      })

      emptyInstance = new Vue()
    })

    it('find number class from StyleSheet', () => {
      const vnode = new VNode('p', { staticClass: `${style.rect} ${style.position}` })
      vnode.context = emptyInstance
      const elm = patch(null, vnode)

      rectTestCase(elm)
      positionTestCase(elm)
    })

    it('find string class from context styleScope', () => {
      const vnode = new VNode('p', { staticClass: `rect position` })
      vnode.context = scopeInstance
      const elm = patch(null, vnode)

      rectTestCase(elm)
      positionTestCase(elm)
    })

    it('should create an element with class', () => {
      const vnode = new VNode('p', { class: `${style.rect}` })
      vnode.context = emptyInstance

      const elm = patch(null, vnode)
      rectTestCase(elm)
    })

    it('should create an element with array class', () => {
      const vnode = new VNode('p', { class: ['position', `${style.rect}`] })
      vnode.context = scopeInstance
      const elm = patch(null, vnode)

      rectTestCase(elm)
      positionTestCase(elm)
    })

    it('should create an element with object class', () => {
      const vnode = new VNode('p', {
        class: { position: true, rect: false }
      })
      vnode.context = scopeInstance
      const elm = patch(null, vnode)

      rectNullTestCase(elm)
      positionTestCase(elm)
    })
  })
})
