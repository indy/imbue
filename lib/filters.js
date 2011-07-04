/*!
 * headdown
 * Copyright(c) 2011 indy <email@indy.io>
 * MIT Licensed
 */


/**
 * adds a prefix to each element of obj
 */

exports.prefixWith = function(obj, prefix) {
  return Array.isArray(obj)
    ? obj.map(function(i){ return prefix + i}).join('\n')
    : prefix + String(obj) + '\n';
}
