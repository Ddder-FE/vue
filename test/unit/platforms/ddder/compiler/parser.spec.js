/**
 * Created by zhiyuan.huang@rdder.com on 17/6/16.
 */

'use strict';

import { parse } from 'compiler/parser/index'
import { extend } from 'shared/util'
import { baseOptions } from 'ddder/compiler/options'

describe('normalize reserved tag name', () => {
  const options = extend({}, baseOptions)
  it('div to DIV', () => {
    const ast = parse('<div>hello world</div>', options)
    expect(ast.tag).toBe('DIV')
    expect(ast.plain).toBe(true)
    expect(ast.children[0].text).toBe('hello world')
  })

  it('img to IMG', () => {
    const ast = parse('<img/>', options)
    expect(ast.tag).toBe('IMG')
  })

  it('camera to Camera', () => {
    const ast = parse('<camera/>', options)
    expect(ast.tag).toBe('Camera')
  })

  it('stroke-canvas to StrokeCanvas', () => {
    const ast = parse('<stroke-canvas/>', options)
    expect(ast.tag).toBe('StrokeCanvas')
  })

  it('input to INPUT', () => {
    const ast = parse('<input/>', options)
    expect(ast.tag).toBe('INPUT')
  })

  it('audio to AudioNode', () => {
    const ast = parse('<audio/>', options)
    expect(ast.tag).toBe('AudioNode')
  })

  it('body to BODY', () => {
    const ast = parse('<body></body>', options)
    expect(ast.tag).toBe('BODY')
  })

});

describe('x-template parse', () => {
  const options = extend({}, baseOptions)

  it('extract x-template to parent.xTemplateMaps', () => {
    const ast = parse(`
      <div>
      <script type="x-template" id="foo">foo</script>
      <script type="x-template" id="bar">bar</script>
      </div>
    `, options);

    expect(ast.xTemplateMaps['foo']).toBe('"foo"')
    expect(ast.xTemplateMaps['bar']).toBe('"bar"')

    for (let i = 0; i < ast.children.length; ++i) {
      let child = ast.children[i];

      expect(child.tag === 'script' && child.attrsMap.type === 'x-template').toBeFalsy()
    }
  })

  it('the parent element of x-template type script tag will be unplain', () => {
    const ast = parse(`
      <div>
      <script type="x-template">bar</script>
      </div>
    `, options);

    expect(ast.plain).toBeFalsy();
  })

  it('only extract x-template type script tag', () => {
    const ast = parse(`<div><script type="wrong-type" id="wrongType">wrong type</script></div>`, options)

    expect(ast.xTemplateMaps).toBeFalsy()

    expect(ast.children[0].tag).toBe('script')
    expect(ast.children[0].attrsMap.type).toBe('wrong-type')
  })

  it('x-template type script tag without id will be treat as default', () => {
    const ast = parse(`<div><script type="x-template">default</script></div>`, options)

    expect(ast.xTemplateMaps['"default"']).toBe('"default"')
    expect(ast.children.length).toBeFalsy()
  })

  it('those later templates will override the former same id template', () => {
    const ast = parse(`
      <div>
      <script type="x-template">default1</script>
      <script type="x-template">default2</script>
      <script type="x-template" id="foo">foo1</script>
      <script type="x-template" id="foo">foo2</script>
      <script type="x-template" id="bar">bar1</script>
      <script type="x-template" id="bar">bar2</script>
      </div>
    `, options);

    expect(ast.xTemplateMaps['"default"']).toBe('"default2"')
    expect(ast.xTemplateMaps['foo']).toBe('"foo2"')
    expect(ast.xTemplateMaps['bar']).toBe('"bar2"')
  })
});
