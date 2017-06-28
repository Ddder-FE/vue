/**
 * @flow
 *
 * Created by zhiyuan.huang@rdder.com on 17/6/21.
 */

'use strict'

const objects = {}
let uniqueID = 1
const emptyObject = {}

export function register (object: Object) {
  const id = ++uniqueID

  // if (process.env.NODE_ENV !== 'production') {
  //   Object.freeze(object)
  // }

  objects[id] = object
  return id
}

export function getByID (id?: number): Object {
  if (!id) return emptyObject

  const object = objects[id]
  if (!object) return emptyObject

  return object
}

