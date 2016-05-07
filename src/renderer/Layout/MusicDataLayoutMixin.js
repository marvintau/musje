'use strict';

/**
 * Layout mixin for the music data
 * @mixin
 */
var MusicDataLayoutMixin = {

  /**
   * The x position of the music data in the cell.
   * @type {number}
   */
  x: {
    get: function () {
      return this._x;
    },
    set: function (x) {
      this._x = x;
      if (this.el) {
        this.el.attr('x', x);
      }
    }
  },

  /**
   * The y position of the music data in the cell.
   * @type {number}
   */
  y: {
    get: function () {
      return this._y;
    },
    set: function (y) {
      this._y = y;
      if (this.el) { this.el.attr('y', y); }
    }
  },

  /**
   * The x position of the music data in the system.
   * @type {number}
   */
  systemX: {
    get: function () {
      return this.x + this.cell.x + this.cell.measure.x;
    }
  },

  /**
   * The width of the music data.
   * @type {number}
   * @readonly
   */
  width: {
    get: function () {
      return this.def.width;
    }
  }
};

module.exports = MusicDataLayoutMixin;
