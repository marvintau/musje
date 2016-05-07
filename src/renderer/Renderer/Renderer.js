'use strict';

var Snap = require('Snap');
var util = require('../../util');
var Layout = require('../Layout/Layout');
var renderBar = require('./renderBar');
var renderDuration = require('./renderDuration');
var renderCurve = require('./renderCurve');

function renderNote(note, cell, lo) {
  note.el = cell.el.g().transform(Snap.matrix()
                              .translate(note.x, note.y));
  note.el.use(note.def.pitchDef.el);
  renderDuration(note, lo);
}

function renderCell(cell, lo) {
  cell.data.forEach(function (data) {
    switch (data.$type) {
    case 'Rest':
      renderNote(data, cell, lo);
      break;
    case 'Note':
      renderNote(data, cell, lo);
      renderCurve('tie', data);
      renderCurve('slur', data);
      break;
    case 'Time':
      data.el = cell.el.use(data.def.el).attr({
        x: data.x, y: data.y
      });
      break;
    }
  });
}

/**
 * [Renderer description]
 * @class
 * @param svg {string}
 * @param lo {Object}
 */
function Renderer(svg, lo) {
  this._lo = util.extend(Layout.options, lo);
  this.layout = new Layout(svg, this._lo);
}

util.defineProperties(Renderer.prototype,
/** @lends Renderer# */
{
  render: function (score) {
    this._score = score;
    this.layout.flow(score);

    this.renderHeader();
    this.renderContent();
  },

  renderHeader: function () {
    var
      lo = this._lo,
      header = this.layout.header,
      el = header.el,
      width = header.width;

    el.text(width / 2, lo.titleFontSize, this._score.head.title)
      .attr({
        fontSize: lo.titleFontSize,
        fontWeight: lo.titleFontWeight,
        textAnchor: 'middle'
      });

    el.text(width, lo.titleFontSize * 1.5, this._score.head.composer)
      .attr({
        fontSize: lo.composerFontSize,
        fontWeight: lo.composerFontWeight,
        textAnchor: 'end'
      });

    header.height = el.getBBox().height;
  },

  renderContent: function () {
    var lo = this._lo;

    this.layout.content.systems.forEach(function (system) {
      var measures = system.measures;
      measures.forEach(function (measure) {
        renderBar(measure, lo);
        measure.parts.forEach(function (cell) {
          renderCell(cell, lo);
        });
      });
    });
  }
});

module.exports = Renderer;
