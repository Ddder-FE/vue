/* @flow */

import {
  isUndef
} from 'shared/util'

import {
  genClassForVnode
} from 'web/util/index'

export default function updateClass (oldVnode: any, vnode: any) {
  const data: VNodeData = vnode.data
  const oldData: VNodeData = oldVnode.data
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  return genClassForVnode(vnode)
}
