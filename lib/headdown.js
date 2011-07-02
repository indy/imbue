
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
//var fs = require('fs')



//var str = fs.readFileSync(__dirname + '/list.ejs', 'utf8');
//var ret = ejs.render(str, {
//  locals: {
//    names: ['foo', 'bar', 'baz']
//  }
//});


exports.version = '0.0.1';

exports.mdString = function(str) {
  return mdConvertor.makeHtml(str);
}

exports.render = function(str, bindings) {
  return ejs.render(str, bindings);
}

exports.fullRender = function(str, bindings) {
  return mdConvertor.makeHtml(ejs.render(str, bindings));
}

