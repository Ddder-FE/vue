/**
 * Created by zhiyuan.huang@rdder.com on 17/6/21.
 */

'use strict'


const typeProcessors = {}

export function addTypeProcessor(processors) {
  for (const key in processors) {
    typeProcessors[key] = processors[key]
  }
}

export function processStyle(styles) {
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
