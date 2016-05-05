'use strict';

var util = require('../util');
var MusicDataMixin = require('./MusicDataMixin');
var Pitch = require('./Pitch');
var Duration = require('./Duration');

/**
 * @class
 * @param {Object} chord
 * @mixes musje.MusicData
 * @mixes musje.LayoutMusicData
 */
function Chord(chord) {
  util.extend(this, chord);
}

util.defineProperties(Chord.prototype,
/** @lends musje.Chord# */
{
  /**
   * Type of chord.
   * @type {string}
   * @constant
   * @default
   */
  $type: 'Chord',

  /**
   * Pitches in the chord.
   * @type {Array.<musje.Pitch>}
   */
  pitches: {
    get: function () {
      return this._pitches || (this._pitches = []);
    },
    set: function (pitches) {
      this._pitches = pitches.map(function (pitch) {
        return new Pitch(pitch);
      });
    }
  },

  /**
   * Duration of the chord.
   * @type {musje.Duration}
   */
  duration: {
    get: function () {
      return this._duration || (this._duration = new Duration());
    },
    set: function (duration) {
      this._duration = new Duration(duration);
    }
  },

  /**
   * Convert chord to the musje source code string.
   * @return {string} Converted musje source code of the chord.
   */
  toString: function () {
    return '<' + this.pitches.map(function (pitch) {
      return pitch.toString();
    }).join('') + '>' + this.duration;
  },

  toJSON: util.makeToJSON({
    pitches: undefined,
    duration: undefined,
  }, 'chord')
});

util.defineProperties(Chord.prototype, MusicDataMixin);

module.exports = Chord;
