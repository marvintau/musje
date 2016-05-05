'use strict';

var util = require('../util');
var Cell = require('./Cell');

/**
 * @class
 * @param part {Object}
 * @param index {number} - Index of this part in the parts.
 * @param parts {PartwiseParts}
 */
function PartwisePart(index, parts) {
  this._index = index;
  this._parts = parts;
}

util.defineProperties(PartwisePart.prototype,
/** @lends musje.PartwisePart# */
{
  // head: { $ref: '#/objects/PartHead' },

  /**
   * Reference to the parent parts instance.
   * @type {PartwiseParts}
   * @readonly
   */
  parts: {
    get: function () {
      return this._parts;
    }
  },

  /**
   * Measure in a partwise part is cells.
   * @type {Array.<musje.Cell>}
   */
  measures: {
    get: function () {
      return this._measures || (this._measures = []);
    },
    set: function (measures) {
      var
        p = this._index,
        score = this.parts.score,
        mea = this._measures = [];

      measures.forEach(function (cell, m) {
        mea.push(new Cell(cell, m, p, score));
      });
    }
  },

  /**
   * Convert a partwise part to sting.
   * @return {string} Musje partwise part source code.
   */
  toString: function () {
    return this.measures.map(function (cell) {
      return cell;
    }).join(' ');
  },

  /**
   * Custom toJSON method.
   * @method
   * @return {Object}
   */
  toJSON: util.makeToJSON({
    measures: undefined
  })
});

module.exports = PartwisePart;
