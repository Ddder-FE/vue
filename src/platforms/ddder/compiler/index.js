/**
 * Created by zhiyuan.huang@rdder.com on 17/6/2.
 */

'use strict'

import { createCompiler } from 'compiler/index'
import { baseOptions } from './options'

const { compile, compileToFunctions } = createCompiler(baseOptions)
export { compile, compileToFunctions }
