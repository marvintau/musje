'use strict';

var util = require('../util');
var PartwisePart = require('./PartwisePart');


/**
 * Construct partwise score parts.
 * @class
 * @classdesc Partwise score parts.
 * @param score {Score}
 * @augments {Array}
 */
function PartwiseParts(score) {
  var parts = [];
  parts._score = score;
  util.defineProperties(parts, properties);
  return parts;
}

/** @lends PartwiseParts# */
var properties = {

  /**
   * Reference to the parent score.
   * @readonly
   */
  score: {
    get: function () {
      return this._score;
    }
  },

  /**
   * Add parts.
   * @param {Object}
   */
  addParts: function (parts) {
    var that = this;
    parts.forEach(function (part) {
      that.append(part);
    });
  },

  /**
   * Append a partwise part.
   * @param {Object} part - Plain partwise part object.
   */
  append: function (part) {
    var index = this.length;
    var musjePart = new PartwisePart(index, this);
    this.push(musjePart);
    musjePart.measures = part.measures;
  },

  /**
   * Remove all parts.
   */
  removeAll: function () {
    this.length = 0;
  }
};

module.exports = PartwiseParts;
