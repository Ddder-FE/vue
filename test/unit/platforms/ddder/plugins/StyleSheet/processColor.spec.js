/**
 * Created by zhiyuan.huang@rdder.com on 17/6/22.
 */

'use strict'

import processColor from 'ddder/runtime/plugins/StyleSheet/processColor'

describe('processColor', () => {
  describe('predefined color names', () => {
    it('should convert red', () => {
      var colorFromString = processColor('red')
      expect(colorFromString).toEqual('rgba(255, 0, 0, 255)')
    })

    it('should convert white', () => {
      var colorFromString = processColor('white')
      expect(colorFromString).toEqual('rgba(255, 255, 255, 255)')
    })

    it('should convert black', () => {
      var colorFromString = processColor('black')
      expect(colorFromString).toEqual('rgba(0, 0, 0, 255)')
    })

    it('should convert transparent', () => {
      var colorFromString = processColor('transparent')
      expect(colorFromString).toEqual('rgba(0, 0, 0, 0)')
    })
  })

  describe('RGB strings', () => {
    it('should convert rgb(x, y, z)', () => {
      var colorFromString = processColor('rgb(10, 20, 30)')
      expect(colorFromString).toEqual('rgba(10, 20, 30, 255)')
    })
  })

  describe('RGBA strings', () => {
    it('should convert rgba(x, y, z, a)', () => {
      var colorFromString = processColor('rgba(10, 20, 30, 0.4)')
      expect(colorFromString).toEqual('rgba(10, 20, 30, 102)')
    })
  })

  describe('HSL strings', () => {
    it('should convert hsl(x, y%, z%)', () => {
      var colorFromString = processColor('hsl(318, 69%, 55%)')
      expect(colorFromString).toEqual('rgba(219, 61, 172, 255)')
    })
  })

  describe('HSLA strings', () => {
    it('should convert hsla(x, y%, z%, a)', () => {
      var colorFromString = processColor('hsla(318, 69%, 55%, 0.25)')
      expect(colorFromString).toEqual('rgba(219, 61, 172, 64)')
    })
  })

  describe('hex strings', () => {
    it('should convert #xxxxxx', () => {
      var colorFromString = processColor('#1e83c9')
      expect(colorFromString).toEqual('rgba(30, 131, 201, 255)')
    })
  })
})
