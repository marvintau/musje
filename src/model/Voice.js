'use strict';

var util = require('../util');
var MusicDataMixin = require('./MusicDataMixin');

/**
 * @class
 * @param {Object} voice
 */
function Voice(voice) {
  util.extend(this, voice);
}

util.defineProperties(Voice.prototype,
/** @lends musje.Voice# */
{
  /**
   * Convert the voice to musje source code string.
   * @return {string} Converted musje source code string.
   */
  toString: function () {

  }
});

util.defineProperties(Voice.prototype, MusicDataMixin);

module.exports = Voice;
