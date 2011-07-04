var assert = require('assert');
var headdown = require('../lib/headdown');
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
  assert.equal(headdown.renderString(input, data), expected);

  var compiledFn = headdown.compile(input, {});
  assert.equal(compiledFn(data), expected);

  var compiledFn2 = headdown.compile(input, {bindings: data});
  assert.equal(compiledFn2({}), expected);
}

exports['test version'] = function() {
  assert.equal(headdown.version, '0.0.2');
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


