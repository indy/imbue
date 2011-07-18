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

// EJS configuration, specifying neater delimeters and monkey
// patching it's filters with Imbue's [own](filters.html)
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
    return renderContents(str, utils.deepMerge(locals, b));
  }
}

// Render the markup in **str** using the given **bindings**
exports.renderString = function(str, bindings) {
  return renderContents(str, bindings);
}

// Expand the EJS within **str** but don't render any Markdown
exports.renderStringEJS = function(str, bindings) {
  return renderContentsEJS(str, bindings);
}

// Render the markup within **fname** using the given **bindings**
exports.renderFile = function(fname, bindings) {
  var str = fs.readFileSync(fname, 'utf8');
  return renderContents(str, bindings);
}

// Expand the EJS in the file **fname** but don't render any Markdown
exports.renderFileEJS = function(fname, bindings) {
  var str = fs.readFileSync(fname, 'utf8');
  return renderContentsEJS(str, bindings);
}

// Return the parsed contents of the header in **str**
exports.getHeader = function(str) {
  return headerContents(str);
}

// Return the parsed contents of the header in the file **fname**
exports.getHeaderFromFile = function(fname) {
  var str = fs.readFileSync(fname, 'utf8');
  return headerContents(str);
}

// Expand the EJS within the body of **str** using data from both **bindings** and **str**'s header
function renderContentsEJS(str, bindings) {
  var contents = headerAndBody(str);
  var mergedBindings = utils.deepMerge({locals: bindings}, 
                                       {locals: contents.header});
  return ejs.render(contents.body, mergedBindings);
}

// Render the contents of **str**, first by expanding any EJS expressions and then by rendering the resultant Markdown content
function renderContents(str, bindings) {
  var ejsRender = renderContentsEJS(str, bindings);
  var r, mdConvertor;

  if(bindings._noMarkdown) {
    r = ejsRender;
  } else {
    mdConvertor = new showdown.Showdown.converter();
    r = mdConvertor.makeHtml(ejsRender);
  }

  return r.trim();
}

// Return the header data from **input**
function headerContents(input) {
  var hb = headerAndBody(input);
  return hb.header;
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
  var header = {};
  var body = input;
  var headerMarkerLength = 3;

  if(input.slice(0, headerMarkerLength) === '---') {
    var inputRem = input.slice(headerMarkerLength)
    var endHeader = headerDelimiterPos(inputRem);
    header = parseHeader(inputRem, endHeader);
    body = inputRem.slice(endHeader + headerMarkerLength);
  }

  return {header: header, body: body};
}

