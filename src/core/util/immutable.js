/* @flow */
/**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

// compatible with v4.0.0-rc.10
export const IS_COLLECTION_SYMBOL = '@@__IMMUTABLE_ITERABLE__@@'
export const IS_RECORD_SYMBOL = '@@__IMMUTABLE_RECORD__@@'

export function isImmutableCollection(maybeCollection: any): boolean {
  return Boolean(maybeCollection && maybeCollection[IS_COLLECTION_SYMBOL])
}

export function isImmutableRecord(maybeRecord: any): boolean {
  return Boolean(maybeRecord && maybeRecord[IS_RECORD_SYMBOL])
}

export function isImmutable(maybeImmutable: any): boolean {
  return isImmutableCollection(maybeImmutable) || isImmutableRecord(maybeImmutable)
}
