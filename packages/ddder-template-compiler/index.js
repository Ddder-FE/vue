try {
  var vueFactoryVersion = require('@ddder/vue-framework').version
} catch (e) {}

var packageName = require('./package.json').name
var packageVersion = require('./package.json').version
if (vueFactoryVersion && vueFactoryVersion !== packageVersion) {
  throw new Error(
    '\n\nVue packages version mismatch:\n\n' +
    '- vue@' + vueFactoryVersion + '\n' +
    '- ' + packageName + '@' + packageVersion + '\n\n' +
    'This may cause things to work incorrectly. Make sure to use the same version for both.\n' +
    'If you are using vue-loader@>=10.0, simply update vue-template-compiler.\n' +
    'If you are using vue-loader@<10.0 or vueify, re-installing vue-loader/vueify should bump ' + packageName + ' to the latest.\n'
  )
}

module.exports = require('./build')
