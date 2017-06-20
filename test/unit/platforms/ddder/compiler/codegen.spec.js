/**
 * Created by zhiyuan.huang@rdder.com on 17/6/16.
 */

'use strict'

import { parse } from 'compiler/parser/index'
import { optimize } from 'compiler/optimizer'
import { generate } from 'compiler/codegen'
import { isObject } from 'shared/util'
import { baseOptions } from 'ddder/compiler/options'

function assertCodegen (template, generatedCode, ...args) {
  let staticRenderFnCodes = []
  let generateOptions = baseOptions
  let proc = null
  let len = args.length
  while (len--) {
    const arg = args[len]
    if (Array.isArray(arg)) {
      staticRenderFnCodes = arg
    } else if (isObject(arg)) {
      generateOptions = arg
    } else if (typeof arg === 'function') {
      proc = arg
    }
  }
  const ast = parse(template, baseOptions)
  optimize(ast, baseOptions)
  proc && proc(ast)
  const res = generate(ast, generateOptions)
  expect(res.render).toBe(generatedCode)
  expect(res.staticRenderFns).toEqual(staticRenderFnCodes)
}

describe('codegen', () => {
  it('generate xTemplateMaps', () => {
    assertCodegen(
      `
      <div>
      <script type="x-template">default</script>
      <script type="x-template" id="foo">foo</script>
      <script type="x-template" id="bar">{{bar}}</script>
      </div>
      `,
      `with(this){return _c('DIV',{xTemplateMaps:{"default":"default",foo:"foo",bar:"{{bar}}"}})}`
    )
  })

  it('generate event for custom event', () => {
    assertCodegen(
      '<input @onActionEnd.custom="onInput">',
      `with(this){return _c('INPUT',{on:{"custom":function($event){if(!($event instanceof CustomEvent) || $event.eventName.toLowerCase() !== 'onactionend')return null;onInput($event)}}})}`
    )
  })

  it('generate events with generic modifiers', () => {
    assertCodegen(
      '<input @input.stop="onInput">',
      `with(this){return _c('INPUT',{on:{"input":function($event){$event.cancelBubble = true;onInput($event)}}})}`
    )
    assertCodegen(
      '<input @input.prevent="onInput">',
      `with(this){return _c('INPUT',{on:{"input":function($event){$event.preventDefault = true;onInput($event)}}})}`
    )
    assertCodegen(
      '<input @input.self="onInput">',
      `with(this){return _c('INPUT',{on:{"input":function($event){if($event.eventTarget !== $event.originalTarget)return null;onInput($event)}}})}`
    )
  })
})
