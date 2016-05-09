/* globals describe, it, expect */
'use strict';

var Duration = require('../Duration');

describe('Duration', function () {
  var duration = new Duration();

  it('#$type', function () {
    expect(duration.$type).to.equal('duration');
    expect(function () { duration.$type = 1; }).to.throw(TypeError);
  });

  it('#toString()');

  it('#toJSON()');
});
