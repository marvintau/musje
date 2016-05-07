/* globals describe, it, expect */
'use strict';

var Pitch = require('../Pitch');

describe('Pitch', function () {
  var parentMock = {};
  var pitch = new Pitch(parentMock);

  it('#parent', function () {
    expect(pitch.parent).to.equal(parentMock);
  });

  it('#step', function () {
    expect(pitch.step).to.equal(1);
    expect(new Pitch(parentMock, { step: 5 }).step).to.equal(5);
  });

  it('#octave', function () {
    expect(pitch.octave).to.equal(0);
    expect(new Pitch(parentMock, { octave: -3 }).octave).to.equal(-3);
  });

  it('#accidental', function () {
    expect(pitch.accidental).to.equal('');
    expect(new Pitch(parentMock, { accidental: '#' }).accidental).to.equal('#');
  });

  it('#alter', function () {
    expect(pitch.alter).to.equal(0);
    expect(new Pitch(parentMock, { accidental: '' }).alter).to.equal(0);
    expect(new Pitch(parentMock, { accidental: '#' }).alter).to.equal(1);
    expect(new Pitch(parentMock, { accidental: '##' }).alter).to.equal(2);
    expect(new Pitch(parentMock, { accidental: 'b' }).alter).to.equal(-1);
    expect(new Pitch(parentMock, { accidental: 'bb' }).alter).to.equal(-2);
    expect(new Pitch(parentMock, { accidental: 'n' }).alter).to.equal(0);
  });

  it('#alterLink');

  it('#midiNumber', function () {
    expect(pitch.midiNumber).to.equal(60);
    expect(new Pitch(parentMock, { step: 5 }).midiNumber).to.equal(67);
    expect(new Pitch(parentMock, { step: 5, octave: 1 }).midiNumber).to.equal(79);
    expect(new Pitch(parentMock, { step: 5, octave: 1, accidental: '#' }).midiNumber).to.equal(80);
  });

  it('#frequency', function () {
    expect(pitch.frequency).to.within(261.62, 261.63);
    expect(new Pitch(parentMock, { step: 6 }).frequency).to.equal(440);
    expect(new Pitch(parentMock, { step: 2, octave: -1, accidental: 'b' }).frequency).to.within(138.59, 138.60);
    expect(new Pitch(parentMock, { step: 5, octave: 1, accidental: '#' }).frequency).to.within(830.60, 830.61);
  });

  it('#toString()');

  it('#toJSON()');
});
