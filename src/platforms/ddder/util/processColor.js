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
  return `rgba(${int32ColorToRgba(int32Color).join(', ')})`
}

function int32ColorToRgba(val) {
  const b = val & 255

  val = val >>> 8
  const g = val & 255

  val = val >>> 8
  const r = val & 255

  val = val >>> 8
  const a = val & 255

  return [r, g, b, a]
}

function validateColorHexValue(val) {
  if (val > 255) return 255
  else if (val < 0) return 0
  else return val
}

export function processColorToRGB(color, keepAlpha = false) {
  if (color === undefined || color === null) {
    return color
  }

  let int32Color = normalizeColor(color)

  if (int32Color === null) {
    return undefined
  }

  // Converts 0xrrggbbaa into 0xaarrggbb
  int32Color = (int32Color << 24 | int32Color >>> 8) >>> 0;
  let r = int32ColorToRgba(int32Color);

  return !keepAlpha ? RGB(r[0], r[1], r[2]) : RGBA(r[0], r[1], r[2], r[3]);
}
