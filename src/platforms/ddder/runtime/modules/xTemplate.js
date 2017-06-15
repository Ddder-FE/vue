/**
 * Created by zhiyuan.huang@rdder.com on 17/6/7.
 */

/* @flow */

'use strict';

import {
  isDef,
  isUndef
} from 'shared/util'

function updateInstanceXTemplates(oldVNode: VNode, vnode: VNode) {
  const data: VNodeData = vnode.data
  const oldData: VNodeData = oldVNode.data

  if (isUndef(data.xTemplateMaps) && (isUndef(oldData) || isUndef(oldData.xTemplateMaps))) {
    return
  }

  const context: Component = vnode.context;

  let nodeXTemplateMaps = data.xTemplateMaps;
  let instanceXTemplateMaps = context._xTemplateMaps;

  if (!instanceXTemplateMaps) {
    instanceXTemplateMaps = context._xTemplateMaps = {}
  }

  // 将各后代node 中的xTemplateMap 都注册到Vue 组件实例中
  // 注意，这里存在模板id 覆盖的问题，暂时不给出解决方案
  for (let templateKey in nodeXTemplateMaps) {
    if (!nodeXTemplateMaps.hasOwnProperty(templateKey)) continue;

    instanceXTemplateMaps[templateKey] = nodeXTemplateMaps[templateKey];
  }
}

export default {
  create: updateInstanceXTemplates,
  update: updateInstanceXTemplates
}
