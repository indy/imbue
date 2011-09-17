var assert = require('assert');
var filters = require('../lib/filters');

exports['prefixWith'] = function() {
  assert.equal(filters.prefixWith(['a', 'b', 'c'], 'pref-'),
               'pref-a\npref-b\npref-c');
  assert.equal(filters.prefixWith('a', 'pref-'),
               'pref-a\n');
}

exports['escape'] = function() {

  var tests = [['&', '&amp;'],
               ['foo&bar', 'foo&amp;bar'],
               ['<', '&lt;'],
               ['foo<bar', 'foo&lt;bar'],
               ['foo<bar<<', 'foo&lt;bar&lt;&lt;'],
               ['>', '&gt;'],
               ['foo>bar', 'foo&gt;bar'],
               ['foo>bar>>', 'foo&gt;bar&gt;&gt;'],
               ['"', '&quot;'],
               ['"foo"', '&quot;foo&quot;']];

  tests.forEach(function(t) {
    assert.equal(filters.escape(t[0]), t[1]);
  });
}

exports['printDate'] = function() {
  assert.equal(filters.printDate(new Date(2020, 0, 1)), 'January 01, 2020');
}

