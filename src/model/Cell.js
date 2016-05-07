'use strict';

var util = require('../util');
var near = util.near;
var Beam = require('./Beam');
var Classes = {
  time:  require('./Time'),
  bar:   require('./Bar'),
  note:  require('./Note'),
  rest:  require('./Rest'),
  chord: require('./Chord'),
  voice: require('./Voice')
};

function getBeamGroups(cell, groupDur) {
  var counter = 0, group = [], groups = [];

  function inGroup() {
    return counter < groupDur && !near(counter, groupDur);
  }
  function putGroup() {
    if (group.length > 1) { groups.push(group); }
    group = [];
  }

  cell.data.forEach(function (musicData) {
    if (musicData.$type !== 'Note' && musicData.$type !== 'Rest') {
      return;
    }
    var
      duration = musicData.duration,
      dur = duration.quarter;

    counter += dur;

    if (inGroup()) {
      if (duration.underbar) { group.push(musicData); }
    } else if (near(counter, groupDur)) {
      group.push(musicData);
      putGroup();
      counter = 0;
    } else {
      putGroup();
      counter %= groupDur;
    }
  });

  putGroup();

  return groups;
}

/**
 * Construct a cell.
 * Cell is either a measure in a partwise part, or
 * a part in a timewise measure.
 * @class
 * @param cell {Object}
 * @param mIndex {number} - Measure index of this cell.
 * @param pIndex {number} - Part index of this cell.
 * @mixes CellLayout
 */
function Cell(cell, mIndex, pIndex, score) {
  this._mIndex = mIndex;
  this._pIndex = pIndex;
  this._score = score;
  util.extend(this, cell);
  this.makeBeams(1);
}

util.defineProperties(Cell.prototype,
/** @lends musje.Cell# */
{
  /**
   * Reference to the root score instance.
   * @type {Score}
   * @readonly
   */
  score: {
    get: function () {
      return this._score;
    }
  },

  /**
   * Music data
   * @type {Array.<MusicDataMixin>}
   */
  data: {
    get: function () {
      return this._data || (this._data = []);
    },
    set: function (data) {
      var that = this;
      that.length = 0;
      data.forEach(function (datum) {
        that.append(datum);
      });
    }
  },

  /**
   * Reference to the parent measures.
   * @type {TimewiseMeasures}
   * @readonly
   */
  measures: {
    get: function () {
      return this.score.measures;
    }
  },

  /**
   * Reference to the parent measure.
   * @type {TimewiseMeasure}
   * @readonly
   */
  measure: {
    get: function () {
      return this.measures[this._mIndex];
    }
  },

  /**
   * Reference to the parent parts.
   * @type {PartwiseParts}
   * @readonly
   */
  parts: {
    get: function () {
      return this.score.parts;
    }
  },

  /**
   * Reference to the parent part.
   * @type {PartwisePart}
   * @readonly
   */
  part: {
    get: function () {
      return this.parts[this._pIndex];
    }
  },

  /**
   * Previous cell in the part.
   * @type {Cell|undefined}
   * @readonly
   */
  prev: {
    get: function () {
      return this.part.measures[this._mIndex - 1];
    }
  },

  /**
   * Next cell in the part.
   * @type {Cell|undefined}
   * @readonly
   */
  next: {
    get: function () {
      return this.part.measures[this._mIndex + 1];
    }
  },

  /**
   * The first music data in the cell.
   * @type {MusicDataMixin|undefined}
   * @readonly
   */
  firstData: {
    get: function () {
      return this.data[0];
    }
  },

  /**
   * The last music data in the cell.
   * @type {MusicDataMixin|undefined}
   * @readonly
   */
  lastData: {
    get: function () {
      return this.data[this.data.length - 1];
    }
  },

  /**
   * The left bar of this cell.
   * @type {Bar|undefined}
   * @readonly
   */
  barLeft: {
    get: function () {
      var firstData = this.firstData;

      if (firstData && firstData.$type === 'Bar') {
        return firstData;
      }

      // Take from the previous measure.
      var prevCell = this.prev;
      if (prevCell) {
        return prevCell.barRight;
      }
    }
  },

  /**
   * The right bar of this cell.
   * @type {Bar|undefined}
   * @readonly
   */
  barRight: {
    get: function () {
      var lastData = this.lastData;

      if (lastData && lastData.$type === 'Bar') {
        return lastData;
      }
    }
  },

  /**
   * Append a music data to the cell.
   * @param  {Object} musicData - Music data
   */
  append: function (musicData) {
    var name = Object.keys(musicData)[0];
    var instance = new Classes[name](musicData[name]);

    /**
     * Reference to the parent cell
     * @memberof MusicDataMixin
     * @alias cell
     * @type {Cell}
     * @readonly
     */
    instance.cell = this;

    /**
     * Index of the music data in the cell
     * @memberof musje.MusicData#
     * @alias _index
     * @type {number}
     * @protected
     */
    instance._index = this.data.length;

    this.data.push(instance);
  },

  /**
   * Convert cell to string.
   * @return {string} Converted cell in musje source code.
   */
  toString: function () {
    return this.data.map(function (musicData) {
      return musicData.toString();
    }).join(' ');
  },

  toJSON: util.makeToJSON({
    data: undefined
  }),

  /**
   * Make beams automatically in group by the groupDur.
   * @param {number} groupDur - Duration of a beam group in quarter.
   */
  makeBeams: function (groupDur) {

    getBeamGroups(this, groupDur).forEach(function (group) {

      // beamLevel starts from 0 while underbar starts from 1
      var beamLevel = {};

      function nextHasSameBeamlevel(index, level) {
        var next = group[index + 1];
        return next && next.duration.underbar > level;
      }

      group.forEach(function(data, i) {
        var
          underbar = data.duration.underbar,
          level;

        for (level = 0; level < underbar; level++) {
          if (nextHasSameBeamlevel(i, level)) {

            /**
             * Beams of the note.
             * - Produced by the {@link Cell#makeBeams} method.
             * - The above method is call in {@link Score#prepareCells}.
             * @memberof Note#
             * @alias beams
             * @type {Array.<Beam>}
             */
            data.beams = data.beams || [];

            if (beamLevel[level]) {
              data.beams[level] = new Beam('continue', level, data);
            } else {
              beamLevel[level] = true;
              data.beams[level] = new Beam('begin', level, data);
            }
          } else {
            if (beamLevel[level]) {
              data.beams = data.beams || [];
              data.beams[level] = new Beam('end', level, data);
              delete beamLevel[level];
            }
          }
        }
      });
    });
  }

});

module.exports = Cell;
