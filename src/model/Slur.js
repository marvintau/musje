'use strict';

var util = require('../util');

/**
 * Slur
 * @class
 * @param parent {Note|Chord}
 */
function Slur(parent) {
  this._parent = parent;
}

util.defineProperties(Slur.prototype,
/** @lends Slur# */
{
  /**
   * Parent music data.
   * @type {Note|Chord}
   * @readonly
   */
  parent: {
    get: function () {
      return this._parent;
    }
  },

  begin: '',

  end: '',

  /**
   * Previous slurred parent.
   * @type {Note|Chord}
   * @readonly
   */
  prevParent: {
    get: function () {
      if (!this.end) { return; }

      var prev = this.parent.prevInPart;
      while(prev) {
        if (prev.slur && !prev.slur.isEmpty) {
          return prev;
        }
        prev = prev.prevInPart;
      }
    }
  },

  /**
   * Next Slurred parent.
   * @type {Note|Chord}
   * @readonly
   */
  nextParent: {
    get: function () {
      if (!this.begin) { return; }

      var next = this.parent.nextInPart;
      while(next) {
        if (next.slur && !next.slur.isEmpty) {
          return next;
        }
        next = next.nextInPart;
      }
    }
  },

  /**
   * @todo Nested tie in slur.
   * @type {boolean}
   * @readonly
   */
  prevCrossTie: {
    get: function () {

    }
  },

  /**
   * @todo Nested tie in slur.
   * @type {boolean}
   * @readonly
   */
  nextCrossTie: {
    get: function () {

    }
  },

  /**
   * If the previous slur has error.
   * @type {boolean}
   * @readonly
   */
  prevHasError: {
    get: function () {
      var prev = this.prevParent;
      return !prev || !prev.slur.begin;
    }
  },

  /**
   * If the next slur has error.
   * @type {boolean}
   * @readonly
   */
  nextHasError: {
    get: function () {
      var next = this.nextParent;
      return !next || !next.slur.end;
    }
  },

  /**
   * If the slur is empty.
   * @type {boolean}
   * @readonly
   */
  isEmpty: {
    get: function () {
      return !(this.begin || this.end);
    }
  },

  /**
   * Convert the slur to JSON object.
   * @method
   * @return {Object} JSON object.
   */
  toJSON: util.makeToJSON({
    begin: undefined,
    end: undefined
  })
});

module.exports = Slur;
