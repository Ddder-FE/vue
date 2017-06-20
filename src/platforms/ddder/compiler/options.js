/**
 * @flow
 * Created by zhiyuan.huang@rdder.com on 17/6/2.
 */

import { genStaticKeys } from 'shared/util'

import modules from './modules/index'
import directives from './directives/index'
import { eventModifier } from './codegen/events'

import {
  isReservedTag,
  isUnaryTag,
  mustUseProp,
  getTagNamespace
} from '../util/index'

export const baseOptions: CompilerOptions = {
  modules,
  directives,
  eventModifier,
  isUnaryTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace,
  preserveWhitespace: false,
  staticKeys: genStaticKeys(modules)
}
