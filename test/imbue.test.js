var assert = require('assert');
var imbue = require('../lib/imbue');
var fs = require('fs');

var prefix = 'test/files/';
var postfix = '.expected';

// rather than this simple file comparison it would be better to 
// parse the resultant html and do a DOM compare

function dbgOutput(fn, data, filename) {
  var input = fs.readFileSync(prefix + filename, 'utf8');
  console.log(fn(input, data));
}

function compare(data, filename) {
  var input = fs.readFileSync(prefix + filename, 'utf8');
  var expected = fs.readFileSync(prefix + filename + postfix, 'utf8');

  assert.equal(imbue.renderString(input, data), expected);
  assert.equal(imbue.renderFile(prefix + filename, data), expected);

  var compiledFn = imbue.compile(input, {});
  assert.equal(compiledFn(data), expected);

  var compiledFn2 = imbue.compile(input, {bindings: data});
  assert.equal(compiledFn2({}), expected);
}

function compareHeader(filename, expected) {
  assert.eql(imbue.getHeaderFromFile(prefix + filename), expected);
}

exports['test version'] = function() {
  assert.equal(imbue.version, '0.0.3');
}

exports['render without header'] = function() {
  var locals = { names: ['foo', 'bar', 'baz']};
  compare(locals, 'no-header.hd');
};

exports['render with header'] = function() {
  compare({}, 'header.hd');
};

exports['render zonal'] = function() {
  var zonal = {zonal: { names: ['foo', 'bar', 'baz']}};
  compare(zonal, 'zonal.hd');
};

exports['render zonal with header'] = function() {
  var zonal = {zonal: { names: ['baq', 'baqq', 'baqqq']}};
  compare(zonal, 'zonal-header.hd');
};

exports['render without markdown'] = function() {
  compare({}, 'no-markdown.hd');
};

exports['compare header'] = function() {
  compareHeader('header.hd', {names: ["foo", "bar", "baz"]});
  compareHeader('zonal-header.hd', {names: ["foo", "bar", "baz"], 
                                    title: "hello",
                                    subtitle: "world"});
};

