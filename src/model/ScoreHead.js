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
/** @lends ScoreHead# */
{
  /**
   * Title of the score.
   * @type {string}
   * @default ''
   */
  title: '',

  /**
   * Subtitle of the score.
   * @type {string}
   * @default ''
   */
  subtitle: '',

  /**
   * Subsubtitle of the score.
   * @type {string}
   * @default ''
   */
  subsubtitle: '',

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

  /**
   * Check if the score head is empty.
   * @type {boolean}
   * @readonly
   */
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
