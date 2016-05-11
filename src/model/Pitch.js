'use strict';

var util = require('../util');

// Constants and helpers
// =================================================================

var A4_FREQUENCY = 440;
var A4_MIDI_NUMBER = 69;
var STEP_TO_MIDI_NUMBER = [undefined, 0, 2, 4, 5, 7, 9, 11];
var ACCIDENTAL_TO_ALTER = { '#' : 1, '##': 2, n: 0, b : -1, bb: -2 };

function chars(ch, num) {
  return new Array(num + 1).join(ch);
}

function octaveString(octave) {
  return octave > 0 ? chars('\'', octave) :
         octave < 0 ? chars(',', -octave) : '';
}

/**
 * @class
 * @param parent {Note|Chord}
 * @param pitch {Object}
 */
function Pitch(parent, pitch) {
  this._parent = parent;
  util.extend(this, pitch);
}

util.defineProperties(Pitch.prototype,
/** @lends Pitch# */
{
  /**
   * Reference to the parent parent.
   * @type {Note|Chord}
   * @readonly
   */
  parent: {
    get: function () {
      return this._parent;
    }
  },

  /**
   * Step is a value of `1`, `2`, `3`, `4`, `5`, `6`, or `7`.
   * @type {number}
   * @default
   */
  step: 1,

  /**
   * Octave is an integer value from `-5` to `5` inclusive.
   * @type {number}
   * @default
   */
  octave: 0,

  /**
   * Accidental is either of
   * - `'#'` - sharp
   * - `'##'` - double sharp
   * - `'b'` - flat
   * - `'bb'` - double flat
   * - `'n'` - natural
   * - `''` - (none)
   * @type {string}
   */
  accidental: '',

  /**
   * Alter (from -2 to 2 inclusive).
   *
   * If no accidental in this pitch, it might be affected by a previous note in the same cell (the same part and the same measure).
   * @type {number}
   * @readonly
   */
  alter: {
    get: function () {
      if (this.accidental) {
        return ACCIDENTAL_TO_ALTER[this.accidental];
      }
      var al = this.alterLink;
      return al ? al.alter : 0;
    }
  },

  /**
   * Pitch linked that will affect the alter in this pitch.
   * @type {Pitch|undefined}
   * @readonly
   */
  alterLink: {
    get: function () {
      var prevData = this.parent.prev;

      while(prevData) {
        if (prevData.$type === 'note' &&
            prevData.pitch.step === this.step && prevData.pitch.accidental) {
          return prevData.pitch;
        }
        prevData = prevData.prev;
      }
    }
  },

  /**
   * The MIDI note number of the pitch
   * @type {number}
   */
  midiNumber: {
    get: function () {
      return (this.octave + 5) * 12 +
        STEP_TO_MIDI_NUMBER[this.step] + this.alter;
    }
  },

  /**
   * Frequency of the pitch
   * @type {number}
   * @readonly
   */
  frequency: {
    get: function () {
      return A4_FREQUENCY * Math.pow(2, (this.midiNumber - A4_MIDI_NUMBER) / 12);
    }
  },

  /**
   * Convert to musje source code string.
   * @return {string} Converted musje source code string.
   */
  toString: function () {
    return this.accidental + this.step + octaveString(this.octave);
  },

  toJSON: util.makeToJSON({
    step: 1,
    octave: 0,
    accidental: ''
  })
});

module.exports = Pitch;
