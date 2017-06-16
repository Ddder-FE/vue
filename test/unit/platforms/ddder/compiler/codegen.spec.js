/**
 * Created by zhiyuan.huang@rdder.com on 17/6/16.
 */

'use strict';

import { parse } from 'compiler/parser/index'
import { optimize } from 'compiler/optimizer'
import { generate } from 'compiler/codegen'
import { isObject } from 'shared/util'
import { isReservedTag } from 'ddder/util/index'
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
})
