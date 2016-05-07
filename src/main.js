'use strict';

var parser = require('./parser/parser.jison');
var Score = require('./model/Score');
var Renderer = require('./renderer/Renderer/Renderer');
var util = require('./util');
var PlayerMixin = require('./player/PlayerMixin');

/**
 * Render the score in jianpu (numbered musical notation).
 * @member
 * @function
 * @param {string} svg
 * @param {Object} lo - Layout options.
 */
Score.prototype.render = function (svg, lo) {
  new Renderer(svg, lo).render(this);
};

util.defineProperties(Score.prototype, PlayerMixin);


/** @module musje */
module.exports = {

  /**
   * Parse source musje string to be a Score instance.
   * @param {string} input - Input of the musje source code.
   * @return {Score} - A `Score` instance.
   */
  parse: function (input) {
    var plainScore = parser.parse(input);
    return new Score(plainScore);
  },

  /**
   * Score constructor.
   * @see {@link Score}
   */
  Score: Score
};
