'use strict';

var util = require('../util');

/**
 * @class
 * @param measure {Object}
 * @mixes TimewiseMeasureLayoutMixin
 */
function TimewiseMeasure(index, measures) {
  // this._index = index;
  this._measures = measures;
}

util.defineProperties(TimewiseMeasure.prototype,
/** @lends TimewiseMeasure# */
{
  /**
   * Reference to the parent measures instance.
   * @member {TimewiseMeasures}
   */
  measures: {
    get: function () {
      return this._measures;
    }
  },

  /**
   * Parts in timewise measure.
   * @type {Array.<Cell>}
   */
  parts: {
    get: function () {
      return this._parts || (this._parts = []);
    },
    set: function (parts) {
      this._parts = parts;
    }
  },

  /**
   * Left bar of the measure.
   * @type {Bar}
   * @readonly
   */
  barLeft: {
    get: function () {
      return this.parts[0].barLeft;
    }
  },

  /**
   * Right bar of the measure.
   * @type {Bar}
   * @readonly
   */
  barRight: {
    get: function () {
      return this.parts[0].barRight;
    }
  }
});

module.exports = TimewiseMeasure;
