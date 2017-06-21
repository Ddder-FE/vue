/**
 * Created by zhiyuan.huang@rdder.com on 17/6/21.
 */

'use strict'

class PropTypeError extends Error {
  constructor(msg) {
    super(msg)
  }
}

function throwStyleError(message1, style, caller, message2) {
  throw new PropTypeError(message1 + '\n' + (caller || '<<unknown>>') + ': ' +
    JSON.stringify(style, null, '  ') + (message2 || ''))
}


function returnNull() {
  return null
}

function getProductionTypeChecker() {
  return returnNull
}

function createPrimitiveTypeChecker(expectedType) {
  function validate(props, propName, componentName, location, propFullName) {
    const propValue = props[propName]
    const propType = typeof propValue
    if (propType !== expectedType) {
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'))
    }
    return null
  }
  return validate
}

function createEnumTypeChecker(expectedValues) {
  if (!Array.isArray(expectedValues)) {
    // process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
    return returnNull
  }

  function validate(props, propName, componentName, location, propFullName) {
    const propValue = props[propName]
    for (let i = 0; i < expectedValues.length; i++) {
      if (Object.is(propValue, expectedValues[i])) {
        return null
      }
    }

    const valuesString = JSON.stringify(expectedValues)
    return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'))
  }
  return validate
}

function createUnionTypeChecker(arrayOfTypeCheckers) {
  if (!Array.isArray(arrayOfTypeCheckers)) {
    // process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
    return returnNull
  }

  function validate(props, propName, componentName, location, propFullName) {
    for (let i = 0; i < arrayOfTypeCheckers.length; i++) {
      const checker = arrayOfTypeCheckers[i]
      if (checker(props, propName, componentName, location, propFullName) == null) {
        return null
      }
    }

    return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'))
  }
  return validate
}

let PropTypeChecker

if (process.env.NODE_ENV !== 'production') {
  PropTypeChecker = {
    'number': createPrimitiveTypeChecker('number'),
    'string': createPrimitiveTypeChecker('string'),

    'any': returnNull,

    'oneOfType': createUnionTypeChecker,
    'oneOf': createEnumTypeChecker,
    'shape': returnNull
  }
} else {
  PropTypeChecker = {
    'array': returnNull,
    'number': returnNull,
    'string': returnNull,

    'any': returnNull,

    'oneOfType': getProductionTypeChecker,
    'oneOf': getProductionTypeChecker,
    'shape': returnNull
  }
}

const allStylePropTypes = {};

export function addValidStylePropTypes(stylePropTypes) {
  for (const key in stylePropTypes) {
    allStylePropTypes[key] = stylePropTypes[key]
  }
}

export function validateStyle(name, styles) {
  if (process.env.NODE_ENV === 'production') return

  const style = styles[name]
  for (const prop in style) {
    validateStyleProp(prop, style, 'StyleSheet ' + name)
  }
}

export function validateStyleProp(prop, style, caller) {
  if (process.env.NODE_ENV === 'production') return

  if (allStylePropTypes[prop] === undefined) {
    const message1 = '"' + prop + '" is not a valid style property.'
    const message2 = '\nValid style props: ' +
      JSON.stringify(Object.keys(allStylePropTypes).sort(), null, '  ')

    throwStyleError(message1, style, caller, message2)
  }

  const error = allStylePropTypes[prop](
    style,
    prop,
    caller,
    'prop',
    null
  )

  if (error) {
    throwStyleError(error.message, style, caller)
  }
}

const LayoutPropTypes = {
  width: PropTypeChecker.oneOfType([PropTypeChecker.number, PropTypeChecker.string]),
  height: PropTypeChecker.oneOfType([PropTypeChecker.number, PropTypeChecker.string])
}

addValidStylePropTypes(LayoutPropTypes)
