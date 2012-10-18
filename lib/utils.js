/*!
 * imbue
 * Copyright(c) 2011 indy <email@indy.io>
 * MIT Licensed
 */

// A set of utilities for Imbue

// Public interface to _deepMerge
exports.deepMerge = function(a, b) {
  // start by merging a into an empty object, then do a further merge with b
  return _deepMerge(_deepMerge({},a), b);
}

// Recursively merges **b** into **a**, returning the mutated **a** object.
function _deepMerge(a, b) {
  if(a instanceof Array && b instanceof Array) {
    return a;
  }
  if(typeof a === 'object' && typeof b === 'object') {
    for(var bProp in b) {
      if(a.hasOwnProperty(bProp)) {
        a[bProp] = _deepMerge(a[bProp], b[bProp]);
      }
      else {
        a[bProp] = b[bProp];
      }
    }
  }
  return a;
}
