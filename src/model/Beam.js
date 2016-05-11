'use strict';

var util = require('../util');

/**
 * A [beam][wiki] is a horizontal or diagonal line used to connect multiple consecutive notes (and occasionally rests) in order to indicate rhythmic grouping. Only eighth notes (quavers) or shorter can be beamed.
 *
 * [wiki]: https://en.wikipedia.org/wiki/Beam_(music)
 *
 * Beam is created by {@link Cell#makeBeams} and
 * attached to {@link Durable} in {@link Durable#beams}[level]
 * @class
 * @param {string} value - Beam value: `'begin'`, `'continue'` or `'end'`.
 * @param {number} level - Beam level starting from 0 to up.
 * @param {Durable} parent - The parent durable music data.
 */
function Beam(value, level, parent) {
  this._value = value;
  this._level = level;
  this._parent = parent;
}

util.defineProperties(Beam.prototype,
/** @lends Beam# */
{
  /**
   * Parent
   * @type {Note|Rest|Chord}
   * @readonly
   */
  parent: {
    get: function () {
      return this._parent;
    }
  },

  /**
   * Beam value: `'begin'`, `'continue'` or `'end'`.
   * @type {string}
   * @readonly
   */
  value: {
    get: function () {
      return this._value;
    }
  },

  /**
   * Beam level starting from 0 to up.
   * @type {number}
   * @readonly
   */
  level: {
    get: function () {
      return this._level;
    }
  },

  /**
   * The end parent music data of the beam group.
   * @type {MusicDataMixin}
   */
  endDurable: {
    get: function () {
      var nextData = this.parent.next;
      while (nextData && nextData.beams[this.level].value !== 'end') {
        nextData = nextData.next;
      }
      return nextData;
    }
  }
});

module.exports = Beam;
