/* @flow */
/* globals renderer */
// renderer is injected by ddder factory wrapper

/**
 * Created by zhiyuan.huang@rdder.com on 17/6/2.
 */

'use strict';

export function createElement (tagName: string) {
  return new renderer.Element(tagName);
}

// we use div to mock text node
export function createTextNode(text) {
  let mockTextNode = createElement('div')
  mockTextNode.append(text)

  mockTextNode.getNodeType = () => 'text'

  mockTextNode.text = text

  return mockTextNode
}

export function createComment(text) {
  let mockCommentNode = createElement('div')
  mockCommentNode.append(text)

  mockCommentNode.getNodeType = () => 'comment'

  mockCommentNode.comment = text

  return mockCommentNode
}

export function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode)
}

export function removeChild(node, child) {
  node.removeChild(child)
}

export function appendChild(node, child) {
  node.appendChild(child)
}

export function parentNode(node) {
  return node.parent || node.parentNode
}

export function nextSibling(node) {
  if (node.hasOwnProperty('nextSibling')) return node.nextSibling
}

export function tagName(node) {
  return node.getNodeType()
}

export function setTextContent(node, text) {

  //
  // node.getContent().clearAll()
  // node.append(text)
}

export function setAttribute(node, key, val) {
  node.setAttr(key, val)
}
