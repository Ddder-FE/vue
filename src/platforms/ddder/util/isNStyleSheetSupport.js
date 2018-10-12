/**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

import { isNative } from 'core/util/index'
import { VM_NSTYLESHEET_NAMESPACE_SYMBOL } from './NStyleSheetSymbol';

const isNativeSupportNStyleSheet = isNative(NStyleSheet);

export default function isNStyleSheetSupport(vm) {
  return isNativeSupportNStyleSheet && !!vm.$options[VM_NSTYLESHEET_NAMESPACE_SYMBOL];
};
