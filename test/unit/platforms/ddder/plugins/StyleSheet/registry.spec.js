/**
 * Created by zhiyuan.huang@rdder.com on 17/6/22.
 */

'use strict'

import * as registry from 'ddder/runtime/plugins/StyleSheet/registry'

describe('registry', () => {
  it('register object and get it by id', () => {
    const obj = {
      foo: 2,
      bar: true,
      zoo: 'hello'
    }

    const id = registry.register(obj)

    expect(typeof id).toBe('number')

    expect(registry.getByID(id)).toBe(obj)
  })
})
