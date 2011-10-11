
/*!
 * imbue
 * Copyright(c) 2011 indy <email@indy.io>
 * MIT Licensed
 */



// prefixes every element in **obj** with **prefix**
//
exports.prefixWith = function(obj, prefix) {
  return Array.isArray(obj)
    ? obj.map(function(i){ return prefix + i}).join('\n')
    : prefix + String(obj) + '\n';
};

exports.escape = function(html) {
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

exports.printDate = function(d) {
  return d.toLocaleDateString().split(',').slice(1).join(',').trim();
}

// This function solves an issue I had using imbue to generate it's own project page. I wanted to output text of the form "{{= foo }}", unfortunately imbue tries to lookup the value binded to foo. So instead, the source file should contain: {{=: "foo" | printAsVarDecl }} and that will output "{{= foo }}"
exports.printAsVarDecl = function(s) {
  return "{{= " + s + " }}";
}
