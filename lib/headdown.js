
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

exports.renderStringEJS = function(str, bindings) {
  return renderContentsEJS(str, bindings);
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
  var mergedBindings = deepMerge({locals: bindings}, {locals: contents.header});
  var expanded = ejs.render(contents.body, mergedBindings);
  return mdConvertor.makeHtml(expanded);

}

function renderContentsEJS(str, bindings) {
  var contents = headerAndBody(str);
  var mergedBindings = deepMerge({locals: bindings}, {locals: contents.header});
  var expanded = ejs.render(contents.body, mergedBindings);
  return expanded;
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

function headerDelimiterPos(inputRem) {
  var patt = /-{3}/;
  var endHeader = inputRem.search(patt);
  if(endHeader === -1) {
    // raise an error
  }
  return endHeader;
}

function parseHeader(inputRem, endHeader) {
  var dataString = inputRem.slice(0, endHeader);
  var wrappedDataString = "{" + dataString + "}";
  return JSON.parse(wrappedDataString);
}


// separate the header from the body
function headerAndBody(input) {
  var header = '';
  var body = input;
  var headerMarkerLength = 3;

  if(input.slice(0, headerMarkerLength) === '---') {
    // contains a header
    var inputRem = input.slice(headerMarkerLength)
    var endHeader = headerDelimiterPos(inputRem);
    header = parseHeader(inputRem, endHeader);
    body = inputRem.slice(endHeader + headerMarkerLength);
  }

  return {header: header, body: body};
}