/* global musje */

(function (musje) {
  'use strict';

  // @constructor Defs
  // SVG definitions
  var Defs = musje.Defs = function (layout) {
    this._layout = layout;
  };

  Defs.prototype.get = function (musicData) {
    var id = musicData.defId;
    return this[id] || (this[id] = this._make(id, musicData));
  };

  Defs.prototype.getAccidental = function (accidental) {
    var id = 'a' + accidental.replace(/#/g, 's');
    return this[id] ||
        (this[id] = new Defs.AccidentalDef(id, accidental, this._layout));
  };

  Defs.prototype._make = function (id, musicData) {
    var maker = '_make' + musicData.$name;
    return this[maker](id, musicData) || { width: 0, height: 0 };
  };

  Defs.prototype._makeBar = function (id, bar) {
    return new Defs.BarDef(id, bar, this._layout);
  };

  Defs.prototype._makeTime = function (id, time) {
    return new Defs.TimeDef(id, time, this._layout);
  };

  Defs.prototype._makeDuration = function (id, duration) {
    return new Defs.DurationDef(id, duration, this._layout);
  };

  Defs.prototype._getPitch = function (id, pitch, underbar) {
    return this[id] ||
        (this[id] = new Defs.PitchDef(id, pitch, underbar, this));
  };

  Defs.prototype._makeNote = function (id, note) {
    var
      pitch = note.pitch,
      duration = note.duration,
      underbar = duration.underbar,
      pitchId = pitch.defId + underbar,
      pitchDef = this._getPitch(pitchId, pitch, underbar),
      durationDef = this.get(duration);

    return {
      pitchDef: pitchDef,
      durationDef: durationDef,
      height: pitchDef.height,
      width: pitchDef.width + durationDef.width *
                              (underbar ? pitchDef.scale.x : 1)
    };
  };

  // Make rest is a trick to use a note with pitch.step = 0.
  Defs.prototype._makeRest = function(id, rest) {
    return this._makeNote(id, new musje.Note({
      pitch: { step: 0 },
      duration: rest.duration
    }));
  };

}(musje));
