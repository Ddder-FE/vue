/**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

export let nextlySmpDecode = function(val) {
  const regexp = /\u0012((?:\w{4})+)\u0013/ig;

  return val.replace(regexp, function(charPoints) {
    let charPointGroup = charPoints.match(/\w{4}/g).map(charPoint => eval("'" + '\\u' + charPoint + "'"));
    charPointGroup.pop();
    return charPointGroup.join('');
  });
};
