'use strict';

var Snap = require('Snap');
var util = require('../../util');

/**
 * Body
 * @class
 * @param {Layout} layout
 */
function BodyLayout(layout) {
  this._layout = layout;
  var svg = layout.svg;
  var lo = layout.options;
  this._el = svg.el.g()
      .transform(Snap.matrix().translate(lo.marginLeft, lo.marginTop))
      .addClass('mus-body');
  this.width = lo.width - lo.marginLeft - lo.marginRight;
}

util.defineProperties(BodyLayout.prototype,
/** @lends BodyLayout# */
{
  el: {
    get: function () {
      return this._el;
    }
  },

  /**
   * Width of the body.
   * - (Getter) Get the body width.
   * - (Setter) Set the body width and this also induces setting the
   * header and content width if one exists.
   * @type {number}
   */
  width: {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
      var layout = this._layout;
      if (layout.header) { layout.header.width = w; }
      if (layout.content) { layout.content.width = w; }
    }
  },

  /**
   * Height of the body.
   * - (Getter) Get the body height.
   * - (Setter) Set the body height and this will also cause the height of svg to vary.
   * @type {number}
   */
  height: {
    get: function () {
      return this._h;
    },
    set: function (h) {
      var layout = this._layout, lo = layout.options;
      layout.svg.height = h + lo.marginTop + lo.marginBottom;
      this._h = h;
    }
  }
});

module.exports = BodyLayout;
