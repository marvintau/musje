'use strict';

var util = require('../util');

/**
 * Construct head of the score.
 * @class
 * @param {Object} head
 */
function ScoreHead(head) {
  util.extend(this, head);
}

util.defineProperties(ScoreHead.prototype,
/** @lends musje.ScoreHead# */
{
  /**
   * Title of the score.
   * @type {string}
   */
  title: undefined,

  /**
   * Subtitle of the score.
   * @type {string}
   */
  subtitle: undefined,

  /**
   * Subsubtitle of the score.
   * @type {string}
   */
  subsubtitle: undefined,

  /**
   * Composer of the score.
   * @type {string}
   */
  composer: undefined,

  /**
   * Arranger of the score.
   * @type {string}
   */
  arranger: undefined,

  /**
   * Lyricist of the score.
   * @type {string}
   */
  lyricist: undefined,

  isEmpty: {
    get: function () {
      return !this.title && !this.subtitle && !this.subsubtitle &&
             !this.composer && !this.arranger && !this.lyricist;
    }
  },

  /**
   * Convert score head to string.
   * @return {string} The converted musje head source code.
   */
  toString: function () {
    return '' + (this.title ? ('<<' + this.title + '>>') : '') +
            (this.composer || '') +
            '\n';
  },

  toJSON: util.makeToJSON({
    title: undefined,
    subtitle: undefined,
    subsubtitle: undefined,
    composer: undefined,
    lyricist: undefined
  })
});

module.exports = ScoreHead;
