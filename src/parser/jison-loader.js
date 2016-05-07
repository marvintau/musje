/* Webpack loader for jison parser generator */

'use strict';

var jisonCli = require('jison/lib/cli');

module.exports = function(input) {
  this.cacheable();

  var grammar = jisonCli.processGrammars(input);
  var options = { 'module-type': 'js' };
  var parserString = jisonCli.generateParserString(options, grammar);

  return parserString + '\nmodule.exports = parser;';
};