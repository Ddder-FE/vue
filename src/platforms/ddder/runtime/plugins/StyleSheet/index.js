/**
 *
 * Created by zhiyuan.huang@rdder.com on 17/6/21.
 */

'use strict'

import { cached } from 'shared/util'

import { addValidStylePropTypes, validateStyle } from './propValidator'
import * as registry from './registry'
import { addTypeProcessor, processStyle } from './propProcessor'

import isNStyleSheetSupport from '../../../util/isNStyleSheetSupport';
import * as NStyleSheetSymbol from '../../../util/NStyleSheetSymbol';

const hyphenateRE = /([^-])([A-Z])/g
const hyphenate = cached(str => {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
})

function normalizeName (name) {
  return hyphenate(name)
}

function getStyle (style) {
  if (typeof style === 'number') {
    return registry.getByID(style)
  }
  return style
}

function flatten (style) {
  if (!style) return undefined

  if (!Array.isArray(style)) {
    return getStyle(style)
  }

  const result = {}

  for (let i = 0; i < style.length; ++i) {
    const computedStyle = flatten(style[i])
    if (computedStyle) {
      for (const key in computedStyle) {
        result[key] = computedStyle[key]
      }
    }
  }

  return result
}

export function install (Vue) {
  // export StyleSheet to Vue Global and Prototype
  Vue.StyleSheet = Vue.prototype.StyleSheet = {
    addValidStylePropTypes,
    validateStyle,

    addTypeProcessor,
    processStyle,

    flatten,
    create: function (obj) {
      const result = {}

      for (const key in obj) {
        // validateStyle(key, obj)
        result[key] = registry.register(obj[key])
      }

      return result
    }
  }

  Vue.mixin({
    created: function() {
      let styleScope = this['styleScope'];

      if (!styleScope) return;

      this.styleScope = null;
      styleScope = Object.keys(styleScope).reduce((result, key) => {
        let styles = processStyle(getStyle(styleScope[key]));
        result[key] = Object.keys(styles).reduce((subResult, prop) => {
          subResult[normalizeName(prop)] = styles[prop];
          return subResult;
        }, {});
        return result;
      }, {});

      this.styleScope = Object.freeze(styleScope);

      if (isNStyleSheetSupport(this)) {
        let styleSheet = this.$document[NStyleSheetSymbol.DOCUMENT_NSTYLESHEET_SINGLETON_SYMBOL];
        let documentStyleSheetNamespaces = this.$document[NStyleSheetSymbol.DOCUMENT_NSTYLESHEET_NAMESPACES_SYMBOL];
        let componentStyleSheetNamespace = this.$options[NStyleSheetSymbol.VM_NSTYLESHEET_NAMESPACE_SYMBOL];

        if (!styleSheet) {
          styleSheet = new NStyleSheet();
          this.$document[NStyleSheetSymbol.DOCUMENT_NSTYLESHEET_SINGLETON_SYMBOL] = styleSheet;
          this.$document.setStyleSheet(styleSheet);
        }

        if (!documentStyleSheetNamespaces) {
          documentStyleSheetNamespaces = {};
          this.$document[NStyleSheetSymbol.DOCUMENT_NSTYLESHEET_NAMESPACES_SYMBOL] = documentStyleSheetNamespaces;
        }

        if (documentStyleSheetNamespaces[componentStyleSheetNamespace] === true) return;

        Object.keys(styleScope).forEach(key => {
          let value = styleScope[key];
          styleSheet.defineClass(key + '_' + componentStyleSheetNamespace, Object.keys(value).reduce((result, prop) => {
            result.push(prop + ':' + value[prop]);
            return result;
          }, []).join(';'));
        });

        documentStyleSheetNamespaces[componentStyleSheetNamespace] = true;
      }
    },
  })
}
