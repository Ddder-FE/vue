/**
 * copy from React-Native processColor
 * */
/* eslint-disable */
'use strict'

import normalizeColor from './normalizeColor'

/* eslint no-bitwise: 0 */
export default function processColor(color) {
  if (color === undefined || color === null) {
    return color
  }

  let int32Color = normalizeColor(color)
  if (int32Color === null) {
    return undefined
  }

  // Converts 0xrrggbbaa into 0xaarrggbb
  int32Color = (int32Color << 24 | int32Color >>> 8) >>> 0

  // Converts 0xaarrggbb into rgba(rr, gg, bb, aa)
  return int32ColorToRgba(int32Color)
}

function int32ColorToRgba(val) {
  let aRgbInt10ColorArray = val.toString(16).match(/.{1,2}/g) || []

  let a = aRgbInt10ColorArray[0]
  let r = aRgbInt10ColorArray[1]
  let g = aRgbInt10ColorArray[2]
  let b = aRgbInt10ColorArray[3]

  if (a !== undefined) {
    a = parseInt(a, 16)

    if (a >= 255) a = 1
    else if (a <= 0) a = 0
    else a = (a / 255).toFixed(2)
  } else {
    a = 1
  }

  r = r ? parseInt(r, 16) : 0
  g = g ? parseInt(g, 16) : 0
  b = b ? parseInt(b, 16) : 0

  return `rgba(${[r, g, b, a].join(', ')})`
}
