'use strict';

var Snap = require('Snap');

/**
 * SVG definition for time signature.
 * @class
 * @param {string} id     [description]
 * @param {Time} time   [description]
 * @param {Layout} layout [description]
 */
function TimeDef(id, time, layout) {
  var lo = layout.options;
  var timeFontSize = lo.timeFontSize;
  var lineExtend = timeFontSize * 0.1;
  var el = this.el = layout.svg.el.g()
    .attr({
      id: id,
      fontSize: timeFontSize,
      fontWeight: lo.timeFontWeight,
      textAnchor: 'middle'
    });
  var lineY = -0.85 * timeFontSize;
  var bb;

  el.text(0, -1 * timeFontSize, time.beats);
  el.text(0, 0, time.beatType);   // baseline y = 0
  bb = el.getBBox();
  el.line(bb.x - lineExtend, lineY, bb.x2 + lineExtend, lineY);
  el.transform(Snap.matrix().scale(1, 0.8).translate(lineExtend - bb.x, 0));

  bb = el.getBBox();
  el.toDefs();

  this.width = bb.width;
  this.height = -bb.y;
}

module.exports = TimeDef;
