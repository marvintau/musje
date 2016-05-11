'use strict';

var Snap = require('Snap');

function renderCurve(type, note) {
  var next, prev, prevHasError, nextHasError;

  if (note[type].end) {
    prev = note[type].prevParent;
    prevHasError = note[type].prevHasError;

    if (!prev || prev.system !== note.system) {
      renderEndCurve(note, prevHasError);
    } else if (prevHasError) {
      renderCompleteCurve(note, prev, prevHasError);
    }
  }

  if (note[type].begin) {
    next = note[type].nextParent;
    nextHasError = note[type].nextHasError;

    if (!next || next.system !== note.system) {
      renderBeginCurve(note, nextHasError);
    } else {
      renderCompleteCurve(note, next, nextHasError);
    }
  }
}

function getCurvePath(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  var c1x = 0; //-0.1 * dx;
  var c1y = 0; //-0.1 * dy;
  var c2x = dx; //1.1 * dx;
  var c2y = dy; //1.1 * dy;

  return Snap.format('M{x1},{y1}c{c1x},{c1y} {c2x},{c2y} {dx},{dy}c{c3x},{c3y} {c4x},{c4y} {negDx},{negDy}', {
    x1: x1,
    y1: y1,
    c1x: c1x,
    c1y: c1y - 8,
    c2x: c2x,
    c2y: c2y - 8,
    dx: dx,
    dy: dy,
    c3x: -c1x,
    c3y: -c1y - 10,
    c4x: -c2x,
    c4y: -c2y - 10,
    negDx: -dx,
    negDy: -dy
  });
}

function renderEndCurve(note, error) {
  var x1 = note.def.pitchDef.stepCx;
  var y1 = note.def.pitchDef.stepTop;
  var x2 = - note.systemX - 3;
  var el = note.el.path(getCurvePath(x1, y1, x2, y1 - 3));

  if (error) { el.addClass('mus-error'); }
  return el;
}

function renderBeginCurve(note, error) {
  var x1 = note.def.pitchDef.stepCx;
  var y1 = note.def.pitchDef.stepTop;
  var x2 = note.system.width - note.systemX + 3;
  var el = note.el.path(getCurvePath(x1, y1, x2, y1 - 3));

  if (error) { el.addClass('mus-error'); }
  return el;
}

function renderCompleteCurve(note1, note2, error) {
  var x1 = note1.def.pitchDef.stepCx;
  var y1 = note1.def.pitchDef.stepTop;
  var x2 = note2.def.pitchDef.stepCx;
  var y2 = note2.def.pitchDef.stepTop;
  var noteDx = note2.systemX - note1.systemX;
  var el = note1.el.path(getCurvePath(x1, y1, noteDx + x2, y2));

  if (error) { el.addClass('mus-error'); }
  return el;
}

module.exports = renderCurve;
