/* globals describe, it, expect */
'use strict';

var Bar = require('../Bar');

describe('Bar', function () {
  var bar = new Bar();

  it('#$type', function () {
    expect(bar.$type).to.equal('bar');
    expect(function () { bar.$type = 1; }).to.throw(TypeError);
  });

  it('#value', function () {
    expect(bar.value).to.equal('single');
    expect(new Bar('double').value).to.equal('double');
  });

  it('#toString()');

  it('#toJSON()');
});
