/**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

import { processColorToRGB } from './processColor'

function textStyle(elm, stylesheet) {
  let fontSize, textColor;

  const fontSizeKey = 'font-size';
  const textColorKey = 'text-color';

  if (stylesheet[fontSizeKey] != null) {
    fontSize = stylesheet[fontSizeKey];
    delete stylesheet[fontSizeKey];
  }

  if (stylesheet[textColorKey] != null) {
    textColor = stylesheet[textColorKey];
    delete stylesheet[textColorKey];
  }

  if (fontSize == null && textColorKey == null) return;

  let textStyle = elm.createTextStyle(null, fontSize, processColorToRGB(textColor));
  elm.currentTextStyle = textStyle;
  elm.setTextStyle(0, elm.textContent.length, textStyle);
}

const patchSequence = [textStyle];

export default function patchStylesheet(elm, stylesheet) {
  patchSequence.forEach(middleware => {
    middleware(elm, stylesheet);
  });
}
