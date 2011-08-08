var assert = require('assert');
var utils = require('../lib/utils');



exports['simple merge'] = function() {
  var alpha = {a: "a string", c: [1, 2, 3]};
  var beta = {b: {d: 3, e: 4}};

  assert.eql(utils.deepMerge(alpha, beta),
             {a: "a string", b: {d: 3, e: 4}, c: [1, 2, 3]});
}

exports['child merge'] = function() {
  var beta = {b: {d: 3, e: 4}};
  var delta = {b: {f: 5, g: 6}};

  assert.eql(utils.deepMerge(beta, delta),
             {b: {d: 3, e: 4, f: 5, g: 6}});
}

exports['array priority merge'] = function() {
  var alpha = {a: [0, 1, 2], c: [1, 2, 3]};
  var beta = {a: [7, 8, 9], b: [1, 2, 3]};

  assert.eql(utils.deepMerge(alpha, beta),
             {a: [0, 1, 2], 
              b: [1, 2, 3],
              c: [1, 2, 3]});
}


exports['merge returns copy not a reference'] = function() {
  var beta = {b: {d: 3, e: 4}};
  var delta = {b: {f: 5, g: 6}};

  var res = utils.deepMerge(beta, delta);

  beta.b = 1;
  delta.b = 1;

  assert.eql(res,
             {b: {d: 3, e: 4, f: 5, g: 6}});
}
