'use strict';

var util = require('../util');
var MusicDataMixin = require('./MusicDataMixin');
var Duration = require('./Duration');

/**
 * @class
 * @param {rest} rest
 * @mixes musje.MusicData
 * @mixes musje.LayoutMusicData
 */
function Rest(rest) {
  util.extend(this, rest);
}

util.defineProperties(Rest.prototype,
/** @lends musje.Rest# */
{
  /**
   * Type of rest.
   * @type {string}
   * @constant
   * @default
   */
  $type: 'Rest',

  /**
   * Duration of the rest.
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
   * Convert the rest to musje source code string.
   * @return {string} Converted musje source code.
   */
  toString: function () {
    return '0' + this.duration;
  },

  toJSON: util.makeToJSON({
    duration: undefined,
  }, 'rest')
});

util.defineProperties(Rest.prototype, MusicDataMixin);

module.exports = Rest;
