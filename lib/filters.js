
/*!
 * imbue
 * Copyright(c) 2011 indy <email@indy.io>
 * MIT Licensed
 */



// prefixes every element in **obj** with **prefix**
//
exports.prefixWith = function(obj, prefix) {
  return Array.isArray(obj)
    ? obj.map(function(i){ return prefix + i}).join('\n')
    : prefix + String(obj) + '\n';
}
