'use strict';

var util = require('../../util');
var layoutOptions = require('./layoutOptions');
var Defs = require('../defs/Defs');
var SvgLayout = require('./SvgLayout');
var BodyLayout = require('./BodyLayout');
var HeaderLayout = require('./HeaderLayout');
var ContentLayout = require('./ContentLayout');

var TimewiseMeasure = require('../../model/TimewiseMeasure');
var TimewiseMeasureLayoutMixin = require('./TimewiseMeasureLayoutMixin');
var Cell = require('../../model/Cell');
var CellLayoutMixin = require('./CellLayoutMixin');
var MusicDataLayoutMixin = require('./MusicDataLayoutMixin');
[
  require('../../model/Time'),
  require('../../model/Bar'),
  require('../../model/Note'),
  require('../../model/Rest'),
  require('../../model/Chord'),
  require('../../model/Voice')
].forEach(function (Class) {
  util.defineProperties(Class.prototype, MusicDataLayoutMixin);
});
util.defineProperties(TimewiseMeasure.prototype, TimewiseMeasureLayoutMixin);
util.defineProperties(Cell.prototype, CellLayoutMixin);

/**
 * @class
 * @param svg {string}
 * @param options {Object} Layout options
 */
function Layout(svg, options) {
  this.options = options;
  this.svg = svg;

  this.svg = new SvgLayout(this);
  this.body = new BodyLayout(this);
  this.header = new HeaderLayout(this);
  this.content = new ContentLayout(this);

  this.defs = new Defs(this);
}

Layout.options = layoutOptions;

util.defineProperties(Layout.prototype,
/** @lends Layout# */
{
  /**
   * @param  {Score} score
   */
  flow: function (score) {
    this._init(score);
    this.content.flow(score.measures);
  },

  /**
   * @param  {Score} score
   * @protected
   */
  _init: function (score) {
    var
      layout = this,
      measures = score.measures;

    measures.forEach(function (measure, m) {
      measure = measures[m];
      measure.layout = layout;
      measure.parts.forEach(function (cell) {
        cell.layout = layout;
        cell.flow();
      });
    });
  }
});

module.exports = Layout;
