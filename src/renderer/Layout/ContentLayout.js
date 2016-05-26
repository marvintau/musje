'use strict';

var Snap = require('snapsvg');
var util = require('../../util');
var SystemLayout = require('./SystemLayout');

/**
 * @class
 * @param {Object} layout - Reference to the parent layout instance.
 */
function ContentLayout(layout) {
  this.layout = layout;
  this.el = layout.body.el.g().addClass('mus-content');
  this.width = layout.body.width;
}

util.defineProperties(ContentLayout.prototype,
/** @lends ContentLayout# */
{
  y: {
    get: function () {
      return this._y;
    },
    set: function (y) {
      this._y = y;
      this.el.transform(Snap.matrix().translate(0, y));
      resizeBody(this);
    }
  },

  width: {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
    }
  },

  height: {
    get: function () {
      var last = this.systems[this.systems.length - 1];
      return last ? last.y + last.height : 0;
    }
  },

  /**
   * @param scoreMeasure {musje.TimewiseMeasures} The timewise score measure.
   */
  flow: function (scoreMeasures) {
    makeSystems(this, scoreMeasures);
    balanceSystems(this);
    this.systems.forEach(function (system) { system.flow(); });
  }
});

function resizeBody(that) {
  var layout = that.layout, hHeight = layout.header.height;

  layout.body.height = that.height +
        (hHeight ? hHeight + layout.options.headerSep : 0);
}

/**
 * Divide measures in timewise score into the systems.
 * @param scoreMeasure {musje.TimewiseMeasures} The timewise score measure.
 */
function makeSystems(that, scoreMeasures) {
  var layout = that.layout;
  var lo = layout.options;
  var measurePadding = lo.measurePaddingLeft + lo.measurePaddingRight;
  var system = new SystemLayout(layout, 0);
  var systems = that.systems = [system];

  scoreMeasures.forEach(function (measure) {
    var minWidth = measure.minWidth + measurePadding +
                  (measure.barLeftInSystem.width +
                   measure.barRightInSystem.width) / 2;

    // Continue put this measure in the system.
    if (system.minWidth + minWidth < that.width) {
      system.measures.push(measure);

    // New system
    } else {
      system = new SystemLayout(layout, systems.length);
      systems.push(system);
      system.measures.push(measure);
    }
  });
}

function getMaxLengthSystem(that) {
  var maxLength = 0, i, system;

  that.systems.forEach(function (system) {
    maxLength = Math.max(maxLength, system.measures.length);
  });

  // Find the first max length system backward.
  for(i = that.systems.length - 1; i >= 0; i--) {
    system = that.systems[i];
    if (system.measures.length === maxLength) { return system; }
  }
}

function isNotBalancable(that) {
  var systems = that.systems;
  var len = systems.length;
  return len === 1 ||       // only 1 system
        (len === 2 && systems[1].minWidth < that.width * 0.4); // 1 2/5 systems
}

function balanceSystems(that) {
  if (isNotBalancable(that)) { return; }

  var systems = that.systems;
  var last = systems[systems.length - 1];
  var system = getMaxLengthSystem(that);
  var next, prev;

  // Move measures down to balance the last system.
  while (last.measures.length < system.measures.length - 1) {

    // Move a measure tail-to-head downward to the last measure.
    while (true) {
      next = system.next;
      if (!next) { break; }
      next.measures.unshift(system.measures.pop());
      system = next;
    }
    system = getMaxLengthSystem(that);
  }

  // Move back measures if the system exceeds the content width.
  system = last;
  while (system) {
    prev = system.prev;
    while (system.minWidth > that.width) {
      prev.measures.push(system.measures.shift());
    }
    system = prev;
  }
}

module.exports = ContentLayout;
