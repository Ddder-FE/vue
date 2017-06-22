/**
 * Created by zhiyuan.huang@rdder.com on 17/6/21.
 */
/* eslint-disable */
'use strict'

import processColor from './processColor'

const typeProcessors = {}

export function addTypeProcessor(processors) {
  for (const key in processors) {
    typeProcessors[key] = processors[key]
  }
}

export function processStyle(styles) {
  if (!styles) return
  for (const type in styles) {
    processStyleType(type, styles);
  }
}

export function processStyleType(type, styles) {
  if (typeProcessors[type] === undefined) return;

  try {
    let processResult = typeProcessors[type](styles[type])
    styles[type] = processResult
  } catch(e) {
    if (process.env.NODE_ENV !== 'production') {
      throw e;
    }
  }
}

const colorTypes = {
  color: processColor,
  backgroundColor: processColor,
  textColor: processColor,
  fillColor: processColor,
  borderColor: processColor
}

addTypeProcessor(colorTypes)
