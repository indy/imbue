
/*!
 * headdown
 * Copyright(c) 2011 indy <email@indy.io>
 * MIT Licensed
 */

/**
 * Library version.
 */

var showdown = require('../vendor/showdown/showdown')
var mdConvertor = new showdown.Showdown.converter();

var ejs = require('ejs')
var fs = require('fs')

exports.version = '0.0.1';

exports.renderString = function(str, bindings) {
  return renderContents(str, bindings);
}

exports.renderFile = function(fname, bindings) {
  var str = fs.readFileSync(fname, 'utf8');
  return renderContents(str, bindings);
}

// exporting for testing purposes only
exports._deepMerge = function(a, b) {
  return deepMerge(a, b);
}

function renderContents(str, bindings) {
  var contents = headerAndBody(str);
  var mergedBindings = deepMerge(bindings, contents.header);

  var expanded = ejs.render(contents.body, mergedBindings);
  return mdConvertor.makeHtml(expanded);

}

function deepMerge(a, b) {
  if(typeof a === 'object' && typeof b === 'object') {
    for(var bProp in b) {
      if(a.hasOwnProperty(bProp)) {
        a[bProp] = deepMerge(a[bProp], b[bProp]);
      }
      else {
        a[bProp] = b[bProp];
      }
    }
  }
  return a;
}


// separate the header from the body
function headerAndBody(input) {
  var header = '';
  var body = input;
  // TODO
  return {header: header, body: body};
}