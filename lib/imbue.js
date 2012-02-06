/*!
 * imbue
 * Copyright(c) 2011 indy <email@indy.io>
 * MIT Licensed
 */

// Filesystem required for reading imbue files
var fs = require('fs');
// Javascript can be embedded within imbue files
// modified so that it doesn't escape html characters
var ejs = require('../vendor/ejs');

// A pure Javascript version of [Markdown](http://daringfireball.net/projects/markdown/syntax), (this is the Github flavoured markdown)
var showdown = require('../vendor/showdown');
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

exports.version = '0.0.4';

// By exporting a compile function that takes **str**, **options** 
// parameters and returns a function we can use **imbue** as a 
// template engine within [Express](http://expressjs.com)
exports.compile = function(str, options) {
  var b = options.bindings || {};
  return function(locals) {

    var hb = headerAndBody(str);
    var meta = utils.deepMerge({}, b);
    meta = utils.deepMerge(meta, hb.header);
    meta = utils.deepMerge(meta, locals);
    return render(meta, hb.body);
  }
}

exports.addFilters = function(filters) {
  for(var o in filters) {
    ejs.filters[o] = filters[o];
  }
}

exports.mergeMeta = function(meta1, meta2) {
  return utils.deepMerge(meta1, meta2);
}

// Return the parsed contents of the header in **str**
exports.parse = function(str) {
  return headerAndBody(str);
}

// Render the contents of **str** by expanding any EJS expressions followed by converting any Markdown content
exports.render = function(bindings, body) {
  return render(bindings, body);
}


function render(bindings, body) {
  var ejsRender = ejs.render(body, {locals: bindings});
  var r, mdConvertor;

  if(bindings._noMarkdown || bindings._useMarkdown == false) {
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
  var wrapped = "{" + dataString + "}";
  var json;

  try {
    json = JSON.parse(wrapped);
  } catch(e) {
    throw {data: wrapped, 
           e: e,
           message: "imbye failed to parse the JSON header (are all the lines separated with a comma?)"};
  }

  return json;
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

