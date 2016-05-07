'use strict';

var Snap = require('Snap');
var util = require('../../util');

function getPairs(measures) {
  return measures.map(function (measure) {
    return {
      width: measure.minWidth,
      measure: measure
    };
  }).sort(function (a, b) {
    return b.width - a.width;   // descending sort
  });
}

/**
 * @class
 * @param {number} index
 * @param {Layout} layout
 */
function SystemLayout(layout, index) {

  this._index = index;
  this._layout = layout;

  /** @member */
  this.el = layout.content.el.g().addClass('mus-system');
}

util.defineProperties(SystemLayout.prototype,
/** @lends SystemLayout# */
{
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
    var
      system = this,
      minHeight = 0,
      x = 0;

    this._tuneMeasuresWidths();

    this.measures.forEach(function (measure, m) {

      /**
       * Reference to the system.
       * Produced by {@link musje.Layout.System#flow}
       * @memberof musje.TimewiseMeasure#
       * @alias system
       * @type {musje.Layout.System}
       * @readonly
       */
      measure.system = system;

      /**
       * Index of this measure in the system.
       * Produced by {@link musje.Layout.System#flow}
       * @memberof musje.TimewiseMeasure#
       * @alias _sIndex
       * @type {number}
       * @protected
       */
      measure._sIndex = m;

      measure.flow();

      measure.x = x;
      x += measure.width;
      minHeight = Math.max(minHeight, measure.minHeight);
    });

    var prev = this.prev;
    this.y = prev ? prev.y + prev.height + this._layout.options.systemSep : 0;
    this.height = minHeight;
  },

  _isTunable: {
    get: function () {
      var
        ctWidth = this.content.width,
        s = this._index,
        ssLen = this.systems.length;

      return ssLen > 2 ||
         (ssLen === 1 && this.minWidth > ctWidth * 0.7) ||
         (ssLen === 2 && (s === 0 ||
                         (s === 1 && this.minWidth > ctWidth * 0.4)));
    }
  },

  _tuneMeasuresWidths: function () {
    if (!this._isTunable) { return; }

    var
      pairs = getPairs(this.measures),
      length = pairs.length,
      widthLeft = this.width,
      itemLeft = length,
      i = 0,    // i + itemLeft === length
      width;

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
});

module.exports = SystemLayout;
