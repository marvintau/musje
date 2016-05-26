'use strict';

var Snap = require('snapsvg');
var util = require('../../util');

/**
 * SVG definition for pitch.
 * The `PitchDef` is defined by properties: a s o u
 * accidental step octave underbar
 * @class
 * @param id {string}     [description]
 * @param pitch {Pitch}   [description]
 * @param layout {Layout} [description]
 */
function PitchDef(id, pitch, underbar, defs) {
  var layout = this._layout = defs._layout;
  var accidental = pitch.accidental;
  var octave = pitch.octave;
  var scale = getScale(accidental, octave, underbar);
  var el = this.el = layout.svg.el.g()
    .attr({
      id: id,
      stroke: 'black',
      strokeWidth: 2 - (scale.x + scale.y)
    });
  var matrix, sbbox, pbbox;

  this._defs = defs;
  addAccidental(this, accidental);
  addStep(this, pitch.step);
  addOctave(this, octave);

  matrix = getMatrix(this, scale, octave, underbar);
  el.transform(matrix);

  sbbox = this._sbbox;
  sbbox = getBBoxAfterTransform(this.el, sbbox, matrix);

  pbbox = el.getBBox();
  el.toDefs();

  util.extend(this, {
    scale: scale,
    matrix: matrix,
    width: pbbox.width,
    height: -pbbox.y,
    stepCx: sbbox.cx,
    stepY: sbbox.y,
    stepCy: sbbox.cy,
    stepY2: sbbox.y2,
    stepTop: octave > 0 ? pbbox.y : sbbox.y + layout.options.fontSize * 0.2
  });
}

function addAccidental(that, accidental) {
  if (!accidental) {
    that._accidentalX2 = 0;
    return;
  }
  var accDef = that._defs.getAccidental(accidental);
  that.el.use(accDef.el).attr('y', -that._layout.options.accidentalShift);
  that._accidentalX2 = accDef.width;
}

function addStep(that, step) {
  that._sbbox = that.el
    .text(that._accidentalX2, 0, '' + step)
    .attr('font-size', that._layout.options.fontSize)
    .getBBox();
}

function addOctave(that, octave) {
  if (!octave) { return; }

  var lo = that._layout.options;
  var octaveRadius = lo.octaveRadius;
  var octaveOffset = lo.octaveOffset;
  var octaveSep = lo.octaveSep;
  var octaveEl = that.el.g();
  var i;

  if (octave > 0) {
    for (i = 0; i < octave; i++) {
      octaveEl.circle(that._sbbox.cx, that._sbbox.y + octaveOffset - octaveSep * i, octaveRadius);
    }
  } else {
    for (i = 0; i > octave; i--) {
      octaveEl.circle(
        that._sbbox.cx,
        that._sbbox.y2 - octaveOffset - octaveSep * i, octaveRadius
      );
    }
  }
  that.el.add(octaveEl);
}

// Transform the pitch to be in a good baseline position and
// scale it to be more square.
function getMatrix(that, scale, octave, underbar) {
  var lo = that._layout.options;
  var pbbox = that.el.getBBox();
  var dy = (octave >= 0 && underbar === 0 ? -lo.stepBaselineShift : 0) -
                          underbar * lo.underbarSep;
  return Snap.matrix()
    .translate(-pbbox.x, dy)
    .scale(scale.x, scale.y)
    .translate(0, util.near(pbbox.y2, that._sbbox.y2) ? 0 : -pbbox.y2);
}

function getBBoxAfterTransform(container, bbox, matrix) {
  var rect = container.rect(bbox.x, bbox.y, bbox.width, bbox.height);
  var g = container.g(rect);
  rect.transform(matrix);
  bbox = g.getBBox();
  g.remove();
  return bbox;
}

function getScale(hasAccidental, octave, underbar) {
  var absOctave = Math.abs(octave);
  return {
    x: Math.pow(0.97, absOctave + underbar + (hasAccidental ? 2 : 0)),
    y: Math.pow(0.95, absOctave + underbar + (hasAccidental ? 1 : 0))
  };
}

module.exports = PitchDef;
