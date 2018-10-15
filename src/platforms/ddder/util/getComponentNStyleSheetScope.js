/**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

import { VM_NSTYLESHEET_NAMESPACE_SYMBOL } from './NStyleSheetSymbol';

export function getComponentNStyleSheetScope(vm) {
  if (!vm || !vm.$options) return '';

  let scope = vm.$options[VM_NSTYLESHEET_NAMESPACE_SYMBOL];

  if (scope == undefined && vm.$options['classScopeInherited'] === true) {
    let parentVM = vm.$vnode.context;
    scope = getComponentNStyleSheetScope(parentVM) || '';

    vm.$options[VM_NSTYLESHEET_NAMESPACE_SYMBOL] = scope;
  }

  return scope || '';
}
