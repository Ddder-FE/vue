/**
 * Created by zhiyuan.huang@rdder.com on 17/6/22.
 */

'use strict'

import * as propProcessor from 'ddder/runtime/plugins/StyleSheet/propProcessor'

describe('propProcessor', () => {
  it('color type style', () => {
    const style = {
      backgroundColor: '#fff',
      textColor: 'rgb(1, 100, 200)'
    }

    propProcessor.processStyle(style)
    expect(style.backgroundColor).toBe('rgba(255, 255, 255, 255)')
    expect(style.textColor).toBe('rgba(1, 100, 200, 255)')
  })
})
