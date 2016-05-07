'use strict';

var Snap = require('Snap');
var util = require('../../util');

/**
 * @class
 * @param layout {Layout}
 */
function SvgLayout(layout) {
  this._layout = layout;
  var lo = layout.options;

  this.el = Snap(layout.svg).attr({
      fontFamily: lo.fontFamily
    }).addClass('musje');
  this.el.clear();

  this.width = lo.width;
}

util.defineProperties(SvgLayout.prototype,
/** @lends SvgLayout# */
{
  /**
   * Width of the svg.
   * @type {number}
   */
  width: {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
      this.el.attr('width', w);
      var body = this._layout.body;
      if (body) { body.width = w; }
    }
  },

  /**
   * Height of the svg.
   * @type {number}
   */
  height: {
    get: function () {
      return this._h;
    },
    set: function (h) {
      this._h = h;
      this.el.attr('height', h);
    }
  }
});

module.exports = SvgLayout;
