'use strict';

var util = require('../util');
var MusicDataMixin = require('./MusicDataMixin');

/**
 * Time signature.
 * @class
 * @param time {Object}
 * @mixes MusicDataMixin
 * @mixes MusicDataLayoutMixin
 */
function Time(time) {
  util.extend(this, time);
}

util.defineProperties(Time.prototype,
/** @lends Time# */
{
  /**
   * Type of time.
   * @constant
   * @default time
   */
  $type: { constant: 'time' },

  /**
   * How many beats per measure.
   * @type {number}
   * @default
   */
  beats: 4,

  /**
   * Beat type
   * @type {number}
   * @default
   */
  beatType: 4,

  /**
   * Convert to musje source code.
   * @return {string} Musje source code.
   */
  toString: function () {
    return this.beats + '/' + this.beatType;
  },

  toJSON: util.makeToJSON({
    beats: 4,
    beatType: 4
  }, 'time')
});

util.defineProperties(Time.prototype, MusicDataMixin);

module.exports = Time;
