'use strict';

var Snap = require('Snap');
var svgPaths = require('../svgPaths');

/**
 * SVG definition for accidental.
 * @param {string} id         [description]
 * @param {string} accidental [description]
 * @param {Layout} layout     [description]
 */
function AccidentalDef(id, accidental, layout) {
  var
    lo = layout.options,
    el = this.el = layout.svg.el.g().attr('id', id),
    accKey = accidental.replace(/bb/, 'b'), // double flat to be synthesized
    pathData = svgPaths[accKey],
    ratio = svgPaths.ACCIDENTAL_RATIOS[accKey],
    shift = svgPaths.ACCIDENTAL_SHIFTS[accKey],
    path = el.path(pathData),
    bb = el.getBBox();

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
