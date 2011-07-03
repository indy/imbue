var assert = require('assert');
var utils = require('../lib/utils');



exports['deep merge'] = function() {
  var alpha = {a: "a string", c: [1, 2, 3]};
  var beta = {b: {d: 3, e: 4}};
  var delta = {b: {f: 5, g: 6}};

  assert.eql(utils.deepMerge(alpha, beta),
             {a: "a string", b: {d: 3, e: 4}, c: [1, 2, 3]});
  assert.eql(utils.deepMerge(beta, delta),
             {b: {d: 3, e: 4, f: 5, g: 6}});
}
