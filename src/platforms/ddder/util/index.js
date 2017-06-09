/**
 * Created by zhiyuan.huang@rdder.com on 17/6/2.
 */
/* @flow */

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

  for (let i = 0; i < reservedTags.length; i++) {
    let tag = reservedTags[i];

    if (Array.isArray(tag)) tag = tag[0]

    if (typeof tag === 'string') tags.push(tag)
  }

  return tags.join(',')
}

export function mapReservedTags() : {string : string} {
  let map = {}

  for (let i = 0; i < reservedTags.length; i++) {
    let tag = reservedTags[i];

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
