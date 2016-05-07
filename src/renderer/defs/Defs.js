'use strict';

var util = require('../../util');
var AccidentalDef = require('./AccidentalDef');
var BarDef = require('./BarDef');
var DurationDef = require('./DurationDef');
var PitchDef = require('./PitchDef');
var TimeDef = require('./TimeDef');

var defIdMixins = require('./defIdMixins');
var Time = require('../../model/Time');
var Bar = require('../../model/Bar');
var Note = require('../../model/Note');
var Rest = require('../../model/Rest');
var Pitch = require('../../model/Pitch');
var Duration = require('../../model/Duration');
util.defineProperties(Time.prototype, defIdMixins.Time);
util.defineProperties(Bar.prototype, defIdMixins.Bar);
util.defineProperties(Note.prototype, defIdMixins.Note);
util.defineProperties(Rest.prototype, defIdMixins.Rest);
util.defineProperties(Pitch.prototype, defIdMixins.Pitch);
util.defineProperties(Duration.prototype, defIdMixins.Duration);


/**
 * @class
 * @param {Layout} layout
 */
function Defs(layout) {
  this._layout = layout;
}

util.defineProperties(Defs.prototype,
/** @lends Defs# */
{
  /**
   * Get the svg def of the music data.
   * @param  musicData {MusicDataMixin} music data
   * @return {Def}
   */
  get: function (musicData) {
    var id = musicData.defId;
    return this[id] || (this[id] = this._make(id, musicData));
  },

  getAccidental: function (accidental) {
    var id = 'a' + accidental.replace(/#/g, 's');
    return this[id] ||
          (this[id] = new AccidentalDef(id, accidental, this._layout));
  },

  _make: function (id, musicData) {
    var maker = '_make' + musicData.$type;
    return this[maker](id, musicData) || { width: 0, height: 0 };
  },

  _makeBar: function (id, bar) {
    return new BarDef(id, bar, this._layout);
  },

  _makeTime: function (id, time) {
    return new TimeDef(id, time, this._layout);
  },

  _makeDuration: function (id, duration) {
    return new DurationDef(id, duration, this._layout);
  },

  _getPitch: function (id, pitch, underbar) {
    return this[id] ||
          (this[id] = new PitchDef(id, pitch, underbar, this));
  },

  /**
   * Make note.
   * @param id {string}  Def id.
   * @param note {musje.Note} Note
   * @return {Object}
   */
  _makeNote: function (id, note) {
    var
      underbar = note.duration.underbar,
      pitchId = note.pitch.defId + underbar,
      pitchDef = this._getPitch(pitchId, note.pitch, underbar),
      durationDef = this.get(note.duration);

    return {
      pitchDef: pitchDef,
      durationDef: durationDef,
      height: pitchDef.height,
      width: pitchDef.width + durationDef.width *
                              (underbar ? pitchDef.scale.x : 1)
    };
  },

  /**
   * Make rest is a trick to use a note with pitch.step = 0.
   * @protected
   * @param  {string} id   [description]
   * @param  {string} rest [description]
   * @return {Object}      [description]
   */
  _makeRest: function(id, rest) {
    return this._makeNote(id, new Note({
      pitch: { step: 0 },
      duration: rest.duration
    }));
  }
});

module.exports = Defs;
