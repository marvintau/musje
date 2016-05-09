'use strict';

var util = require('../util');
var MusicDataMixin = require('./MusicDataMixin');

var BAR_TO_STRING = {
  single: '|', double: '||', end: '|]',
  'repeat-begin': '|:', 'repeat-end': ':|', 'repeat-both': ':|:'
};

/**
 * @class
 * @param {string} bar - The bar value, which can be either of
 * - 'single' - `|`
 * - 'double' - `||`
 * - 'end' - `|]`
 * - 'repeat-begin' - `|:`
 * - 'repeat-end' - `:|`
 * - 'repeat-both' - `:|:`
 * @mixes MusicDataMixin
 * @mixes MusicDataLayoutMixin
 */
function Bar(bar) {
  this._value = bar;
}

util.defineProperties(Bar.prototype,
/** @lends Bar# */
{
  /**
   * Type of bar.
   * @constant
   * @readonly
   * @default bar
   */
  $type: { constant: 'bar' },

  /**
   * Value of the bar, which is the same as the bar parameter in the constructor.
   * @type {string}
   * @default single
   * @readonly
   */
  value: {
    get: function () {
      return this._value || (this._value = 'single');
    }
  },

  /**
   * Convert bar to string.
   * @return {string} Converted string of the barline in musje source code.
   */
  toString: function () {
    return BAR_TO_STRING[this.value];
  },

  /**
   * [toJSON description]
   * @return {Object} { bar: value }
   */
  toJSON: function () {
    return { bar: this.value };
  }
});

util.defineProperties(Bar.prototype, MusicDataMixin);

module.exports = Bar;
