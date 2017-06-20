/* globals renderer */
// renderer is injected by ddder factory wrapper

/**
 * Created by zhiyuan.huang@rdder.com on 17/6/2.
 */

'use strict'

export function createElement (tagName) {
  return new renderer.Element(tagName)
}

// we use div to mock text node
export function createTextNode (text) {
  const mockTextNode = createElement('text')
  setTextContent(mockTextNode, text)

  return mockTextNode
}

// todo: ddder do not support comment node
export function createComment (text) {
  const mockCommentNode = createElement('comment')
  setTextContent(mockCommentNode, text)

  return mockCommentNode
}

export function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode)
}

export function removeChild (node, child) {
  node.removeChild(child)
}

export function appendChild (node, child) {
  node.appendChild(child)
}

export function parentNode (node) {
  return node.parentNode
}

export function nextSibling (node) {
  return node.nextSibling
}

export function tagName (node) {
  return node.tagName
}

export function setTextContent (node, text) {
  node.textContent = text
}

export function setAttribute (node, key, val) {
  node.setAttr(key, val)
}
