var assert = require('assert');
var imbue = require('../lib/imbue');
var fs = require('fs');

var prefix = 'test/files/';
var postfix = '.expected';
var ext = '.imb';

// rather than this simple file comparison it would be better to 
// parse the resultant html and do a DOM compare

function dbgOutput(fn, data, filename) {
  var input = fs.readFileSync(prefix + filename, 'utf8');
  console.log(fn(input, data));
}

function compare(data, filename) {
  var input = fs.readFileSync(prefix + filename + ext, 'utf8');
  var expected = fs.readFileSync(prefix + filename + ext + postfix, 'utf8');

  var hb = imbue.parse(input);
  var res = imbue.render(imbue.mergeMeta(hb.header, data), hb.body)
  assert.equal(res, expected);

  var compiledFn = imbue.compile(input, {});
//  assert.equal(compiledFn(data), expected);

  var compiledFn2 = imbue.compile(input, {bindings: data});
//  assert.equal(compiledFn2({}), expected);
}

function compareHeader(filename, expected) {
  var input = fs.readFileSync(prefix + filename + ext, 'utf8');
  var res = imbue.parse(input);
  assert.eql(res.header, expected);
}

exports['test version'] = function() {
  assert.equal(imbue.version, '0.0.3');
}

exports['render without header'] = function() {
  var locals = { names: ['foo', 'bar', 'baz']};
  compare(locals, 'no-header');
};

exports['render with header'] = function() {
  compare({}, 'header');
};

exports['render zonal'] = function() {
  var zonal = {zonal: { names: ['foo', 'bar', 'baz']}};
  compare(zonal, 'zonal');
};

exports['render zonal with header'] = function() {
  var zonal = {zonal: { names: ['baq', 'baqq', 'baqqq']}};
  compare(zonal, 'zonal-header');
};

exports['render without markdown'] = function() {
  compare({}, 'no-markdown');
};

exports['compare header'] = function() {
  compareHeader('header', {names: ["foo", "bar", "baz"]});
  compareHeader('zonal-header', {names: ["foo", "bar", "baz"], 
                                        title: "hello",
                                        subtitle: "world"});
};

