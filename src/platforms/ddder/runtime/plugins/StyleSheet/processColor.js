/**
 * copy from React-Native processColor
 * */

'use strict'

import normalizeColor from './normalizeColor'

/* eslint no-bitwise: 0 */
function processColor(color) {
  if (color === undefined || color === null) {
    return color;
  }

  let int32Color = normalizeColor(color);
  if (int32Color === null) {
    return undefined;
  }

  // Converts 0xrrggbbaa into 0xaarrggbb
  int32Color = (int32Color << 24 | int32Color >>> 8) >>> 0;

  // Converts 0xrrggbbaa into rgba(rr, gg, bb, aa)
  return `rgba(${int32Color.toString(16).match(/.{2}/g).join(',')})`;
}

module.exports = processColor;
