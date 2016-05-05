'use strict';

var util = require('../util');
var TimewiseMeasure = require('./TimewiseMeasure');

/**
 * Construct timewise score measures.
 * @class
 * @classdesc Timewise score measures.
 * @param score {musje.Score}
 * @augments {Array}
 */
function TimewiseMeasures(score) {
  var measures = [];
  measures._score = score;
  util.defineProperties(measures, properties);
  return measures;
}

/** @lends TimewiseMeasures# */
var properties = {

  /**
   * Reference to the parent score.
   * @type {Score}
   * @readonly
   */
  score: {
    get: function () {
      return this._score;
    }
  },

  /**
   * Make timewise score measures from the partwise parts.
   */
  fromPartwise: function () {
    var that = this;

    this.removeAll();

    this.score.walkCells(function (cell, m) {
      that[m] = that[m] || new TimewiseMeasure(m, that);
      that[m].parts.push(cell);
    });
  },

  /**
   * Remove all measures.
   */
  removeAll: function () {
    this.length = 0;
  }
};

module.exports = TimewiseMeasures;
