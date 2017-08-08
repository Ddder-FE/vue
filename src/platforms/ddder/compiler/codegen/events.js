/**
 * @flow
 * Created by zhiyuan.huang@rdder.com on 17/6/16.
 */

'use strict'

const genGuard = condition => `if(${condition})return null;`

// todo: need to normalize custom event name
const customEventName = (name: string) => genGuard(`!($event instanceof CustomEvent) || $event.eventName.toLowerCase() !== '${name.toLowerCase()}'`)
const notificationEventName = (name: string) => genGuard(`!($event instanceof NotificationEvent) || $event.name.toLowerCase() !== '${name.toLowerCase()}'`)

const modifierCode: { [key: string]: string } = {
  stop: '$event.cancelBubble = true;',
  prevent: '$event.preventDefault = true;',
  self: genGuard(`$event.eventTarget !== $event.originalTarget`)
}

export function eventModifier (name: string, modifiers: Object) {
  let result = ''

  if (name.match(/custom$/i)) {
    result += customEventName(modifiers.eventName)
    delete modifiers.eventName
  }

  if (name.match(/notification$/i)) {
    result += notificationEventName(modifiers.eventName)
    delete modifiers.eventName
  }

  for (const key in modifiers) {
    if (modifierCode[key]) {
      result += modifierCode[key]
      delete modifiers[key]
    }
  }

  return result
}
