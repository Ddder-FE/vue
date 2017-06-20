/**
 * Created by zhiyuan.huang@rdder.com on 17/6/16.
 */

'use strict'

import Vue from 'vue'
import VNode from 'core/vdom/vnode'

import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'
import xTemplate from 'ddder/runtime/modules/xTemplate'

const modules = platformModules.concat(baseModules, xTemplate)

const patch = createPatchFunction({ nodeOps, modules })

describe('vdom xTemplate module', () => {
  it('register vnode xTemplateMaps to its context', () => {
    const vnode1 = new VNode(
      'div',
      { xTemplateMaps: { foo: 'foo' }},
      [],
      undefined,
      undefined,
      new Vue()
    )

    patch(null, vnode1)
    expect(vnode1.context._xTemplateMaps.foo).toBe('foo')

    const vnode2Context = new Vue()
    const vnode2 = new VNode(
      'div',
      {},
      [new VNode(
        'div',
        { xTemplateMaps: { foo: 'foo' }},
        [],
        undefined,
        undefined,
        vnode2Context
      )],
      undefined,
      undefined,
      vnode2Context
    )

    patch(null, vnode2)
    expect(vnode2Context._xTemplateMaps.foo).toBe('foo')
  })
})
