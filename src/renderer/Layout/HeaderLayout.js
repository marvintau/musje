'use strict';

var util = require('../../util');

/**
 * Header layout.
 * @class
 * @param {musje.Layout} layout
 */
function HeaderLayout(layout) {
  this._layout = layout;
  this.el = layout.body.el.g().addClass('mus-header');
  this.width = layout.body.width;
}

util.defineProperties(HeaderLayout.prototype,
/** @lends musje.Layout.Header# */
{
  /**
   * Width of the header.
   * @type {number}
   */
  width: {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
    }
  },

  /**
   * Height of the header.
   * @type {number}
   */
  height: {
    get: function () {
      return this._h;
    },
    set: function (h) {
      this._h = h;
      var layout = this._layout;
      layout.content.y = h ? h + layout.options.headerSep : 0;
    }
  }
});

module.exports = HeaderLayout;
