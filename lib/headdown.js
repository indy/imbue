
/*!
 * headdown
 * Copyright(c) 2011 indy <email@indy.io>
 * MIT Licensed
 */

var ejs = require('ejs');
var fs = require('fs');
var showdown = require('../vendor/showdown/showdown');
var utils = require('./utils');

var mdConvertor = new showdown.Showdown.converter();

exports.version = '0.0.2';

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

exports.renderFileEJS = function(fname, bindings) {
  var str = fs.readFileSync(fname, 'utf8');
  return renderContentsEJS(str, bindings);
}

function renderContentsEJS(str, bindings) {
  var contents = headerAndBody(str);
  var mergedBindings = utils.deepMerge({locals: bindings}, 
                                       {locals: contents.header});
  return ejs.render(contents.body, mergedBindings);
}

function renderContents(str, bindings) {
  var ejsRender = renderContentsEJS(str, bindings);
  return mdConvertor.makeHtml(ejsRender);
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