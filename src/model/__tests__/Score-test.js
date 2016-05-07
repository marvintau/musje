/* global describe, it, expect */
'use strict';

var Score = require('../Score');
var ScoreHead = require('../ScoreHead');

describe('Score', function () {
  var score = new Score();

  it('#head', function () {
    expect(score.head).to.be.instanceof(ScoreHead);
  });

  it('#parts', function () {
    expect(score.parts).to.be.instanceof(Array);
  });

  it('#measures', function () {
    expect(score.measures).to.be.instanceof(Array);
  });

  it('#toString()');

  it('#toJSON()');
});
