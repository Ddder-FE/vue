/**
 * Created by zhiyuan.huang@rdder.com on 17/6/2.
 */
/* @flow */

'use strict';

import {
  mapReservedTags
} from '../../util/index'

let reservedTagsMap = mapReservedTags()

function preTransformNode(el: ASTElement) {
  if (reservedTagsMap.hasOwnProperty(el.tag)) {
    el.tag = reservedTagsMap[el.tag];
  }
}


export default {
  preTransformNode
}
