/**
 * Created by zhiyuan.huang@rdder.com on 17/6/2.
 */

/* @flow */

'use strict';

import { genStaticKeys } from 'shared/util'

import modules from './modules/index'
import directives from './directives/index'

import {
  isReservedTag,
  isUnaryTag,
  mustUseProp,
  getTagNamespace,
} from '../util/index'

export const baseOptions: CompilerOptions = {
  modules,
  directives,
  isUnaryTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace,
  preserveWhitespace: false,
  staticKeys: genStaticKeys(modules)
}
