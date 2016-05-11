'use strict';

var Snap = require('Snap');
var util = require('../../util');

/**
 * @class
 * @param {number} index
 * @param {Layout} layout
 */
function SystemLayout(layout, index) {
  this._index = index;
  this._layout = layout;
  this._el = layout.content.el.g().addClass('mus-system');
}

util.defineProperties(SystemLayout.prototype,
/** @lends SystemLayout# */
{
  el: {
    get: function () {
      return this._el;
    }
  },

  /**
   * Measures in a system.
   * @type {Array.<TimewiseMeasure>}
   * @readonly
   */
  measures: {
    get: function () {
      return this._measures || (this._measures = []);
    }
  },

  /**
   * Previous system.
   * @type {SystemLayout}
   */
  prev: {
    get: function () {
      return this._layout.content.systems[this._index - 1];
    }
  },

  /**
   * Next system.
   * @type {SystemLayout}
   */
  next: {
    get: function () {
      return this._layout.content.systems[this._index + 1];
    }
  },

  y: {
    get: function () {
      return this._y;
    },
    set: function (y) {
      this._y = y;
      this.el.transform(Snap.matrix().translate(0, y));
    }
  },

  width: {
    get: function () {
      return this._layout.content.width;
    }
  },

  minWidth: {
    get: function () {
      var min = 0;
      this.measures.forEach(function (measure) {
        min += measure.minWidth;
      });
      return min;
    }
  },

  content: {
    get: function () {
      return this._layout.content;
    }
  },

  systems: {
    get: function () {
      return this.content.systems;
    }
  },

  flow: function () {
    var system = this;
    var minHeight = 0;
    var x = 0;

    tuneMeasuresWidths(this);

    this.measures.forEach(function (measure, m) {
      measure.system = system;
      measure._sIndex = m;
      measure.flow();
      measure.x = x;
      x += measure.width;
      minHeight = Math.max(minHeight, measure.minHeight);
    });

    var prev = this.prev;
    this.y = prev ? prev.y + prev.height + this._layout.options.systemSep : 0;
    this.height = minHeight;
  }
});

function tuneMeasuresWidths(that) {
  if (!isTunable(that)) { return; }

  var pairs = getPairs(that.measures);
  var length = pairs.length;
  var widthLeft = that.width;
  var itemLeft = length;
  var i = 0;    // i + itemLeft === length
  var width;

  while (i < length) {
    if (widthLeft >= pairs[i].width * itemLeft) {
      width = widthLeft / itemLeft;
      do {
        pairs[i].measure.width = width;
        i++;
      } while (i < length);
      break;
    } else {
      width = pairs[i].width;
      pairs[i].measure.width = width;
      widthLeft -= width;
      i++;
      itemLeft--;
    }
  }
}

function isTunable(that) {
  var ctWidth = that.content.width;
  var s = that._index;
  var ssLen = that.systems.length;
  return ssLen > 2 ||
     (ssLen === 1 && that.minWidth > ctWidth * 0.7) ||
     (ssLen === 2 && (s === 0 ||
                     (s === 1 && that.minWidth > ctWidth * 0.4)));
}

function descendingSort(a, b) { return b.width - a.width; }

function getPairs(measures) {
  return measures.map(function (measure) {
    return {
      width: measure.minWidth,
      measure: measure
    };
  }).sort(descendingSort);
}

module.exports = SystemLayout;
