'use strict';

/**
 * Music data mixin
 * @mixin
 */
var MusicDataMixin = {

  /**
   * Reference to the parent cell.
   * @type {Cell}
   */
  cell: {
    get: function () {
      return this._cell;
    }
  },

  /**
   * The ascendant system of the music data.
   * @type {SystemLayout}
   * @readonly
   */
  system: {
    get: function () {
      return this.cell.measure.system;
    }
  },

  /**
   * Previous music data.
   * @type {MusicDataMixin|undefined}
   * @readonly
   */
  prev: {
    get: function () {
      return this.cell.data[this._index - 1];
    }
  },

  /**
   * Next music data.
   * @type {MusicDataMixin|undefined}
   * @readonly
   */
  next: {
    get: function () {
      return this.cell.data[this._index + 1];
    }
  },

  /**
   * Previous music data in part, across measure.
   * @type {MusicDataMixin|undefined}
   * @readonly
   */
  prevInPart: {
    get: function () {
      var prev = this.prev, cell = this.cell;
      while (!prev && cell.prev) {
        if (!prev) {
          cell = cell.prev;
          prev = cell.lastData;
        }
      }
      return prev;
    }
  },

  /**
   * Next music data in part, across measure.
   * @type {MusicDataMixin|undefined}
   * @readonly
   */
  nextInPart: {
    get: function () {
      var next = this.next, cell = this.cell;
      while (!next && cell.next) {
        if (!next) {
          cell = cell.next;
          next = cell.firstData;
        }
      }
      return next;
    }
  },

  /**
   * Previous music data which has a duration.
   * @type {MusicDataMixin|undefined}
   * @readonly
   */
  prevDurable: {
    get: function () {
      var prev = this.prev;
      while (prev && !prev.duration) {
        prev = prev.prev;
      }
      return prev;
    }
  },

  /**
   * Next music data which has a duration.
   * @type {MusicDataMixin|undefined}
   * @readonly
   */
  nextDurable: {
    get: function () {
      var next = this.next;
      while (next && !next.duration) {
        next = next.next;
      }
      return next;
    }
  },

  /**
   * Previous music data which has a duration in part, across measure.
   * @type {MusicDataMixin|undefined}
   * @readonly
   */
  prevDurableInPart: {
    get: function () {
      var prev = this.prevInPart;
      while (prev && !prev.duration) {
        prev = prev.prevInPart;
      }
      return prev;
    }
  },

  /**
   * Next music data which has a duration in part, across measure.
   * @type {MusicDataMixin|undefined}
   * @readonly
   */
  nextDurableInPart: {
    get: function () {
      var next = this.nextInPart;
      while (next && !next.duration) {
        next = next.nextInPart;
      }
      return next;
    }
  }
};

module.exports = MusicDataMixin;
