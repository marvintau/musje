'use strict';

/**
 * SVG definition for barline.
 * @class
 * @param {string} id     [description]
 * @param {Bar} bar    [description]
 * @param {Layout} layout [description]
 */
function BarDef(id, bar, layout) {
  var lo = layout.options;
  var x = 0;
  var lineWidth;
  this.el = layout.svg.el.g().attr('id', id).toDefs();

  switch (bar.value) {
  case 'single':
    lineWidth = lo.thinBarlineWidth;
    addBarline(this, x, lineWidth);
    x += lineWidth;
    break;
  case 'double':
    lineWidth = lo.thinBarlineWidth;
    addBarline(this, x, lineWidth);
    x += lineWidth + lo.barlineSep;
    addBarline(this, x, lineWidth);
    x += lineWidth;
    break;
  case 'end':
    lineWidth = lo.thinBarlineWidth;
    addBarline(this, x, lineWidth);
    x += lineWidth + lo.barlineSep;
    lineWidth = lo.thickBarlineWidth;
    addBarline(this, x, lineWidth);
    x += lineWidth;
    break;
  case 'repeat-begin':
    lineWidth = lo.thickBarlineWidth;
    addBarline(this, x, lineWidth);
    x += lineWidth + lo.barlineSep;
    lineWidth = lo.thinBarlineWidth;
    addBarline(this, x, lineWidth);
    x += lineWidth + lo.barlineDotSep + lo.barlineDotRadius;
    break;
  case 'repeat-end':
    x = lo.barlineDotSep + lo.barlineDotRadius;
    lineWidth = lo.thinBarlineWidth;
    addBarline(this, x, lineWidth);
    x += lineWidth + lo.barlineSep;
    lineWidth = lo.thickBarlineWidth;
    addBarline(this, x, lineWidth);
    x += lineWidth;
    break;
  case 'repeat-both':
    x = lo.barlineDotSep + lo.barlineDotRadius;
    lineWidth = lo.thinBarlineWidth;
    addBarline(this, x, lineWidth);
    x += lineWidth + lo.barlineSep;
    lineWidth = lo.thickBarlineWidth;
    addBarline(this, x, lineWidth);
    x += lineWidth + lo.barlineSep;
    lineWidth = lo.thinBarlineWidth;
    addBarline(this, x, lineWidth);
    x += lineWidth + lo.barlineDotSep + lo.barlineDotRadius;
    break;
  }
  this.width = x;
}

function addBarline(that, x, width) {
  that.el.rect(x, 0, width, 1);
}

module.exports = BarDef;
