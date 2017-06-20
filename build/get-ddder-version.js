/**
 * Created by zhiyuan.huang@rdder.com on 17/6/7.
 */

'use strict'

const coreVersion = require('../package.json').version

const ddderVersion = require('../packages/ddder-vue-framework/package.json').version
let ddderBaseVersion = ddderVersion.match(/^[\d.]+/)[0]
let ddderSubVersion = Number(ddderVersion.match(/-ddder\.(\d+)$/)[1])

if (ddderBaseVersion === coreVersion) {
  ddderSubVersion++
} else {
  ddderBaseVersion = coreVersion
  ddderSubVersion = 1
}

if (process.argv[2] === '-c') {
  console.log(ddderVersion)
} else {
  console.log(ddderBaseVersion + '-ddder.' + ddderSubVersion)
}

module.exports = {
  base: ddderBaseVersion,
  sub: ddderSubVersion
}
