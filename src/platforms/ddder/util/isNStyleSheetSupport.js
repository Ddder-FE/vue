/**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

import { isNative } from 'core/util/index'
import { getComponentNStyleSheetScope } from './getComponentNStyleSheetScope';

export const isNativeSupportNStyleSheet = global.NStyleSheet && isNative(NStyleSheet);

export default function isNStyleSheetSupport(vm) {
  return isNativeSupportNStyleSheet && !!getComponentNStyleSheetScope(vm);
};
