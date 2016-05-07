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
    return this[id] || (this[id] = makeDef(id, musicData, this));
  },

  getAccidental: function (accidental) {
    var id = 'a' + accidental.replace(/#/g, 's');
    return this[id] ||
          (this[id] = new AccidentalDef(id, accidental, this._layout));
  },

  _getPitch: function (id, pitch, underbar) {
    return this[id] ||
          (this[id] = new PitchDef(id, pitch, underbar, this));
  }
});


function makeDef(id, musicData, defs) {
  switch (musicData.$type) {
  case 'bar':
    return new BarDef(id, musicData, defs._layout);
  case 'time':
    return new TimeDef(id, musicData, defs._layout);
  case 'note':
    return makeNoteDef(musicData, defs);
  case 'rest':
    return makeRestDef(musicData, defs);
  case 'duration':
    return new DurationDef(id, musicData, defs._layout);
  default:
    return { width: 0, height: 0 };
  }
}

function makeNoteDef(note, defs) {
  var underbar = note.duration.underbar;
  var pitchId = note.pitch.defId + underbar;
  var pitchDef = defs._getPitch(pitchId, note.pitch, underbar);
  var durationDef = defs.get(note.duration);
  return {
    pitchDef: pitchDef,
    durationDef: durationDef,
    height: pitchDef.height,
    width: pitchDef.width + durationDef.width *
                            (underbar ? pitchDef.scale.x : 1)
  };
}

function makeRestDef(rest, defs) {
  return makeNoteDef(new Note({
    pitch: { step: 0 },
    duration: rest.duration
  }), defs);
}

module.exports = Defs;
