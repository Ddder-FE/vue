/**
 * @flow
 * Created by zhiyuan.huang@rdder.com on 17/6/2.
 */

import { warn } from 'core/util/index'
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

export function makeReservedTemplateTags (): string {
  const tags = []

  for (let i = 0; i < reservedTags.length; i++) {
    let tag = reservedTags[i]

    if (Array.isArray(tag)) tag = tag[0]

    if (typeof tag === 'string') tags.push(tag)
  }

  return tags.join(',')
}

export function mapReservedTags (): {[type: string]: string} {
  const map = {}

  for (let i = 0; i < reservedTags.length; i++) {
    const tag = reservedTags[i]

    if (Array.isArray(tag)) map[tag[0]] = tag[1]
    else if (typeof tag === 'string') map[tag] = tag
  }

  return map
}

export const isReservedTag = makeMap(makeReservedTemplateTags())

export function isPreTag () { return false }

export function mustUseProp () { return false }

export function getTagNamespace () {}

export function isUnknownElement () {}

export const isUnaryTag = makeMap('input, img, stroke-canvas, audio, camera')

export const canBeLeftOpenTag = makeMap('')

export function query (el: string | Element, document: Object): Element {
  if (typeof el === 'string') {
    if (el === '__init__') {
      const $el = new renderer.Element('div')
      document.appendChild($el)
      return $el
    } else {
      const selected = document.getElementById(el)
      if (!selected) {
        process.env.NODE_ENV !== 'production' && warn(
          'Cannot find element: ' + el
        )

        const $el = new renderer.Element('div')
        $el.id = el
        document.appendChild($el)
        return $el
      }
    }
    return selected
  } else {
    return el
  }
}
