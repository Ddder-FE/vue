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

  /*
   * 使用createTextStyle 是需要注意，由于存在DIV.defaultFontScale 的存在，可以让开发者按场景更改字体大小缩放，
   * 而createTextStyle 第二个参数，即指定fontSize，若传进来的值不是字符串类型，则不会继承所设置的DIV.defaultFontScale，
   * 而在我们的场景，需要继承defaultFontScale，所以强制将fontSize 转为字符串。
   * */
  if (fontSize == null) {
    fontSize = null;
  } else {
    fontSize = fontSize.toString();
  }

  let textStyle = elm.createTextStyle(null, fontSize, processColorToRGB(textColor, true));
  elm.currentTextStyle = textStyle;
  elm.setTextStyle(0, elm.textContent.length, textStyle);
}

const patchSequence = [textStyle];

export default function patchStylesheet(elm, stylesheet) {
  patchSequence.forEach(middleware => {
    middleware(elm, stylesheet);
  });
}
