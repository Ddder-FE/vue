/* @flow */

/**
 * Created by zhiyuan.huang@rdder.com on 17/6/2.
 */

'use strict';

import * as nodeOps from 'ddder/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'ddder/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
