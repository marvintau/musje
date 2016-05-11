'use strict';

/**
 * SVG definition for duration.
 * @class
 * @param {string} id       [description]
 * @param {Duration} duration [description]
 * @param {Layout} layout   [description]
 */
function DurationDef(id, duration, layout) {
  this._id = id;
  this._layout = layout;

  // only make def el for:
  // id = d10, d11, d12, d20, d21, d20, d41, d40
  switch (duration.type) {
  case 1:   // whole note
    makeEl(this);
    makeType1(this, id, duration.dot);
    break;
  case 2:   // half note
    makeEl(this);
    makeType2(this, id, duration.dot);
    break;
  default:  // other note types type quarter note def
    if (duration.dot === 0) {
      this.width = 0 ;
    } else {
      makeEl(this);
      makeType4(this, id, duration.dot);
    }
  }
}

function makeType1(that, id, dot) {
  var lo = that._layout.options;
  var x = lo.typebarOffset;

  addLine(that, x);
  x += lo.typebarLength + lo.typebarSep;
  addLine(that, x);
  x += lo.typebarLength + lo.typebarSep;
  addLine(that, x);
  x += lo.typebarLength;

  that.width = addDot(that, x, dot, 1);
}

function makeType2(that, id, dot) {
  var lo = that._layout.options;
  var x = lo.typebarOffset;

  addLine(that, lo.typebarOffset);
  x += lo.typebarLength;
  that.width = addDot(that, x, dot, 2);
}

function makeType4(that, id, dot) {
  var lo = that._layout.options;
  var x = lo.t4DotOffset;
  that.el.circle(x, -lo.t4DotBaselineShift, lo.dotRadius);

  if (dot > 1) {
    x += lo.t4DotSep;
    that.el.circle(x, -lo.t4DotBaselineShift, lo.dotRadius);
  }
  that.width = x + lo.t4DotExt;
}

function makeEl(that) {
  that.el = that._layout.svg.el.g()
              .attr('id', that._id)
              .toDefs();
}

function addLine(that, x) {
  var lo = that._layout.options;
  that.el.rect(x, -lo.typeStrokeWidth,
               lo.typebarLength, lo.typeStrokeWidth);
}

// Add dot for type 1 (whole) or type 2 (half) note.
function addDot(that, x, dot, type) {
  var lo = that._layout.options;

  if (dot > 0) {
    x += lo.dotOffset * (type === 1 ? 1.2 : 1);
    that.el.circle(x, 0, lo.dotRadius);
  }
  if (dot > 1) {
    x += lo.dotSep * (type === 1 ? 1.2 : 1);
    that.el.circle(x, 0, lo.dotRadius);
  }
  return x + lo.typebarExt;
}

module.exports = DurationDef;
