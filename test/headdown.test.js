var assert = require('assert');
var headdown = require('../index');
var fs = require('fs');

var prefix = 'test/files/';
var postfix = '.expected';


// rather than this simple file comparison it would be better to 
// parse the resultant html and do a DOM compare
function fileCompare(fn, data, filename) {
  var input = fs.readFileSync(prefix + filename, 'utf8');
  var expected = fs.readFileSync(prefix + filename + postfix, 'utf8');
  assert.equal(fn(input, data), expected);
}

function dbgOutput(fn, data, filename) {
  var input = fs.readFileSync(prefix + filename, 'utf8');
  console.log(fn(input, data));
}

function renderCompare(data, filename) {
  fileCompare(headdown.renderString, data, filename);
}

exports['test version'] = function() {
  assert.equal(headdown.version, '0.0.1');
}

exports['deep merge'] = function() {
  var alpha = {a: "a string", c: [1, 2, 3]};
  var beta = {b: {d: 3, e: 4}};
  var delta = {b: {f: 5, g: 6}};

  assert.eql(headdown._deepMerge(alpha, beta),
             {a: "a string", b: {d: 3, e: 4}, c: [1, 2, 3]});
  assert.eql(headdown._deepMerge(beta, delta),
             {b: {d: 3, e: 4, f: 5, g: 6}});

}


exports['render without header'] = function() {
  var locals = {locals: { names: ['foo', 'bar', 'baz']}};
  renderCompare(locals, 'no-header.hd');
};
/*
exports['render with header'] = function() {
  renderCompare({}, 'header.hd');
};

exports['render zonal'] = function() {
  var zonal = {zonal: { names: ['foo', 'bar', 'baz']}};
  renderCompare(zonal, 'zonal.hd');
};

exports['render zonal with header'] = function() {
  var zonal = {zonal: { names: ['foo', 'bar', 'baz']}};
  renderCompare(zonal, 'zonal-header.hd');
};
*/


//var locals = {locals: { names: ['foo', 'bar', 'baz']}};
//dbgOutput(headdown.fullRender, locals, 'test-render.hd');
