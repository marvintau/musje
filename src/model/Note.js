'use strict';

var util = require('../util');
var MusicDataMixin = require('./MusicDataMixin');
var Pitch = require('./Pitch');
var Duration = require('./Duration');
var Tie = require('./Tie');
var Slur = require('./Slur');

/**
 * @class
 * @param {Object} note
 * @mixes MusicDataMixin
 * @mixes MusicDataLayoutMixin
 */
function Note(note) {
  util.extend(this, note);
}

util.defineProperties(Note.prototype,
/** @lends musje.Note.prototype */
{
  /**
   * Type of note.
   * @type {string}
   * @constant
   * @default
   */
  $type: 'Note',

  /**
   * Pitch of the note.
   * @type {musje.Pitch}
   */
  pitch: {
    get: function () {
      return this._pitch || (this._pitch = new Pitch(this));
    },
    set: function (pitch) {
      this._pitch = new Pitch(this, pitch);
    }
  },

  /**
   * Duration of the note.
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

  beams: {
    get: function () {
      return this._beams || (this._beams = []);
    },
    set: function (beams) {
      this._beams = beams;
    }
  },

  /**
   * Tie
   * @type {musje.Tie}
   */
  tie: {
    get: function () {
      return this._tie || (this._tie = new Tie(this));
    },
    set: function (tie) {

      /**
       * Value of the tie.
       * @memberof musje.Tie#
       * @alias value
       * @type {boolean}
       */
      this.tie.value = tie;
    }
  },

  /**
   * Slur
   * @type {musje.Slur}
   */
  slur: {
    get: function () {
      return this._slur || (this._slur = new Slur(this));
    },
    set: function (slur) {
      util.extend(this.slur, slur);
    }
  },

  /** @method */
  toString: function () {
    return this.slur.begin + this.pitch + this.duration +
           this.slur.end + this.tie.value;
  },

  toJSON: util.makeToJSON({
    pitch: undefined,
    duration: undefined,
    tie: undefined,
    slur: undefined
  }, 'note')
});

util.defineProperties(Note.prototype, MusicDataMixin);

module.exports = Note;
