/* @flow */

import { getStyle } from 'web/util/style'
import { isUndef } from 'shared/util'

export default function updateStyle (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  const data = vnode.data
  const oldData = oldVnode.data

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  return getStyle(vnode, true)
}
