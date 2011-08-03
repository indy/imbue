/*!
 * imbue
 * Copyright(c) 2011 indy <email@indy.io>
 * MIT Licensed
 */

// Filesystem required for reading imbue files
var fs = require('fs');
// Javascript can be embedded within imbue files
var ejs = require('ejs');
// A pure Javascript version of [Markdown](http://daringfireball.net/projects/markdown/syntax)
var showdown = require('../vendor/showdown/showdown');
// Commonly used utilities
var utils = require('./utils');

// Configure EJS so it uses neater delimiters and [Imbue's additional filters](filters.html)
(function configureEJS() {
  ejs.open = '{{';
  ejs.close = '}}';

  var filters = require('./filters');

  for(var o in filters) {
    ejs.filters[o] = filters[o];
  }
})();

exports.version = '0.0.3';

// By exporting a compile function that takes **str**, **options** 
// parameters and returns a function we can use **imbue** as a 
// template engine within [Express](http://expressjs.com)
exports.compile = function(str, options) {
  var b = options.bindings || {};
  return function(locals) {
    return renderContents(utils.deepMerge(locals, b), str);
  }
}

// Render the markup in **str** using the given **bindings**
exports.renderString = function(bindings, str) {
  return renderContents(bindings, str);
}

// Expand the EJS within **str** but don't render any Markdown
exports.renderBodyEJS = function(bindings, body) {
  return renderBodyEJS(bindings, body);
}

exports.renderMarkdown = function(str) {
  mdConvertor = new showdown.Showdown.converter();
  return mdConvertor.makeHtml(str).trim();
}

// Render the markup within **fname** using the given **bindings**
exports.renderFile = function(bindings, fname) {
  var str = fs.readFileSync(fname, 'utf8');
  return renderContents(bindings, str);
}

// Return the parsed contents of the header in **str**
exports.getHeaderAndBody = function(str) {
  return headerAndBody(str);
}

// Expand the EJS within the body of **str** using data from both **bindings** and **str**'s header
function renderContentsEJS(bindings, str) {
  var contents = headerAndBody(str);
  var mergedBindings = utils.deepMerge({locals: bindings}, 
                                       {locals: contents.header});
  return ejs.render(contents.body, mergedBindings);
}

// Expand the EJS within the body of **str** using data from both **bindings** and **str**'s header
function renderBodyEJS(bindings, body) {
  return ejs.render(body, {locals: bindings});
}

// Render the contents of **str** by expanding any EJS expressions followed by converting any Markdown content
function renderContents(bindings, str) {
  var ejsRender = renderContentsEJS(bindings, str);
  var r, mdConvertor;

  if(bindings._noMarkdown) {
    r = ejsRender;
  } else {
    mdConvertor = new showdown.Showdown.converter();
    r = mdConvertor.makeHtml(ejsRender);
  }

  return r.trim();
}

// Returns the position of the closing delimiter that separates the header from the body.
function headerDelimiterPos(inputRem) {
  var patt = /-{3}/;
  var endHeader = inputRem.search(patt);
  if(endHeader === -1) {
    // TODO: raise an error
  }
  return endHeader;
}

// Given the start of the header data and it's closing 
// delimiter, parse the JSON contents of the header
function parseHeader(inputRem, endHeader) {
  var dataString = inputRem.slice(0, endHeader);
  var wrappedDataString = "{" + dataString + "}";
  return JSON.parse(wrappedDataString);
}

// Split the **input** into a header and body, returning
// both sections in a single object
function headerAndBody(input) {
  var imbued = false;
  var header = {};
  var body = input;
  var headerMarkerLength = 3;

  if(input.slice(0, headerMarkerLength) === '---') {
    var inputRem = input.slice(headerMarkerLength)
    var endHeader = headerDelimiterPos(inputRem);
    header = parseHeader(inputRem, endHeader);
    body = inputRem.slice(endHeader + headerMarkerLength);
    imbued = true;
  }

  return { header: header, 
           body: body, 
           imbued: imbued };
}

