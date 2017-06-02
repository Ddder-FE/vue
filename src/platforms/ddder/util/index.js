/**
 * Created by zhiyuan.huang@rdder.com on 17/6/2.
 */

'use strict';

import { makeMap } from 'shared/util'

export const reservedTags = [
  ['node', 'Node'],
  ['div', 'DIV'],
  ['img', 'IMG'],
  ['camera', 'Camera'],
  ['stroke-canvas', 'StrokeCanvas'],
  ['input', 'INPUT'],
  ['audio', 'AudioNode'],
  ['body', 'BODY'],
  'script'
]

export function makeReservedTemplateTags() : Array<string> {
  let tags = []

  for (let tag of reservedTags) {
    if (Array.isArray(tag)) tag = tag[0]

    if (typeof tag === 'string') tags.push(tag)
  }

  return tags
}

export function mapReservedTags() : {string : string} {
  let map = {}

  for (let tag of reservedTags) {
    if (Array.isArray(tag)) map[tag[0]] = tag[1]
    else if (typeof tag === 'string') map[tag] = tag
  }

  return map
}

export const isReservedTag = makeMap(makeReservedTemplateTags())

export function isPreTag () { return false }

export function mustUseProp () {}

export function getTagNamespace () {}

export function isUnknownElement () {}

export const isUnaryTag = makeMap('img, stroke-canvas')

export const canBeLeftOpenTag = makeMap('')

// TODO: no achievement before function purpose is known
export function query () {}