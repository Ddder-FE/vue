/**
 * @flow
 * Created by zhiyuan.huang@rdder.com on 17/6/2.
 */

'use strict'

import {
  mapReservedTags
} from '../../util/index'

const reservedTagsMap = mapReservedTags()

function preTransformNode (el: ASTElement) {
  if (reservedTagsMap.hasOwnProperty(el.tag)) {
    el.tag = reservedTagsMap[el.tag]
  }
}

export default {
  preTransformNode
}
