var assert = require('assert');
var imbue = require('../lib/imbue');
var fs = require('fs');

var prefix = 'test/files/';
var postfix = '.expected';
var ext = '.imd';

// rather than this simple file comparison it would be better to 
// parse the resultant html and do a DOM compare

function dbgOutput(fn, data, filename) {
  var input = fs.readFileSync(prefix + filename, 'utf8');
  console.log(fn(input, data));
}

function compare(data, filename, useMarkdown) {
  var input = fs.readFileSync(prefix + filename + ext, 'utf8');
  var expected = fs.readFileSync(prefix + filename + ext + postfix, 'utf8');

  var hb = imbue.parse(input);
  var res = imbue.render(imbue.mergeMeta(hb.header, data), hb.body, useMarkdown)

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
  assert.equal(imbue.version, '0.0.6');
}

exports['render without header'] = function() {
  var locals = { names: ['foo', 'bar', 'baz']};
  compare(locals, 'no-header', true);
};

exports['render with header'] = function() {
  compare({}, 'header', true);
};

exports['render zonal'] = function() {
  var zonal = {zonal: { names: ['foo', 'bar', 'baz']}};
  compare(zonal, 'zonal', true);
};

exports['render zonal with header'] = function() {
  var zonal = {zonal: { names: ['baq', 'baqq', 'baqqq']}};
  compare(zonal, 'zonal-header', true);
};

exports['render without markdown'] = function() {
  compare({}, 'no-markdown', false);
};

exports['compare header'] = function() {
  compareHeader('header', {names: ["foo", "bar", "baz"]});
  compareHeader('zonal-header', {names: ["foo", "bar", "baz"], 
                                        title: "hello",
                                        subtitle: "world"});
};

exports['only string'] = function() {
  var res = imbue.render("world", "hello {{= content}}", false);
  assert.equal(res, "hello world");  
};

exports['dealing with invalid headers'] = function() {
  var filename = 'invalid'
  var input = fs.readFileSync(prefix + filename + ext, 'utf8');

  assert.throws(function() {
    try {
      imbue.parse(input);
    } catch(e) {
      assert.equal(e.message, "failed to parse the JSON header (are all the lines separated with a comma?)");
      throw(e);
    }
  }, 'whoops', 'ok');
}
