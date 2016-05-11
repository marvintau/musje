'use strict';

var Snap = require('Snap');
var svgPaths = require('../svgPaths');

/**
 * SVG definition for accidental.
 * @class
 * @param {string} id         [description]
 * @param {string} accidental [description]
 * @param {Layout} layout     [description]
 */
function AccidentalDef(id, accidental, layout) {
  var lo = layout.options;
  var el = this.el = layout.svg.el.g().attr('id', id);
  var accKey = accidental.replace(/bb/, 'b'); // double flat to be synthesized
  var pathData = svgPaths[accKey];
  var ratio = svgPaths.ACCIDENTAL_RATIOS[accKey];
  var shift = svgPaths.ACCIDENTAL_SHIFTS[accKey];
  var path = el.path(pathData);
  var bb = el.getBBox();

  path.transform(Snap.matrix()
    .translate(0.1 * lo.accidentalShift, -lo.accidentalShift)
    .scale(ratio * lo.accidentalFontSize)
    .translate(-bb.x, shift - bb.y2)
  );

  // Combine two flat to be double flat.
  if (accidental === 'bb') {
    el.use(path).attr('x', lo.accidentalFontSize * 0.24);
    el.transform('scale(0.9,1)');
  }

  bb = el.getBBox();
  this.width = bb.width * 1.2;

  el.toDefs();
}

module.exports = AccidentalDef;
