/* @flow */

/**
 * Created by zhiyuan.huang@rdder.com on 17/6/2.
 */

'use strict';

import Vue from 'core/index';
import { patch } from 'ddder/runtime/patch';
import { mountComponent } from 'core/instance/lifecycle';
import platformDirectives from 'ddder/runtime/directives/index';
import platformComponents from 'ddder/runtime/components/index';

import {
  mustUseProp,
  isReservedTag,
  isUnknownElement
} from 'ddder/util/index';

// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isUnknownElement = isUnknownElement

// install platform runtime directives and components
Vue.options.directives = platformDirectives
Vue.options.components = platformComponents

Vue.prototype.__patch__ = patch

// wrap mount
Vue.prototype.$mount = function (el?: any, hydrating?: boolean): Component {
  return mountComponent(this, el, hydrating)
}

export default Vue
