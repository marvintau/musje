/* global musje */

/**
 * musje.score model definitions
 */
(function (musje) {
  'use strict';

  var
    A4_FREQUENCY = 440,
    A4_MIDI_NUMBER = 69,
    TEMPO = 80,
    STEP_TO_MIDI_NUMBER = [null, 0, 2, 4, 5, 7, 9, 11],
    ACCIDENTAL_TO_ALTER = { '#' : 1, '##': 2, 'n': 0, 'b' : -1, 'bb': -2 },
    TYPE_TO_STRING = { 1: ' - - - ', 2: ' - ', 4: '', 8: '_', 16: '=', 32: '=_', 64: '==', 128: '==_', 256: '===', 512: '===_', 1024: '====' },
    // Convert from duration type to number of underbars.
    TYPE_TO_UNDERBAR = {
      1: 0, 2: 0, 4: 0, 8: 1, 16: 2, 32: 3,
      64: 4, 128: 5, 256: 6, 512: 7, 1024: 8
    },
    DOT_TO_STRING = { 0: '', 1: '.', 2: '..' },
    BAR_TO_STRING = {single: '|', double: '||', end: '|]', 'repeat-begin': '|:', 'repeat-end': ':|', 'repeat-both': ':|:'};

  function chars(ch, num) {
    return new Array(num + 1).join(ch);
  }

  function octaveString(octave) {
    return octave > 0 ? chars('\'', octave) :
           octave < 0 ? chars(',', -octave) : '';
  }

  musje.model = {
    title: 'Musje',
    description: '123 Music score',

    root: {
      score: {
        head: { $ref: '#/objects/scoreHead' },
        parts: { $ref: '#/arrays/parts' },

        // A cell is identically a measure in a part or a part in a measure.
        walkCells: function (callback) {
          this.parts.forEach(function (part, partIdx) {
            part.measures.forEach(function (cell, measureIdx) {
              callback(cell, measureIdx, partIdx);
            });
          });
        },
        walkMusicData: function (callback) {
          this.walkCells(function (cell, measureIdx, partIdx) {
            cell.forEach(function (musicData, musicDataIdx) {
              callback(musicData, musicDataIdx, measureIdx, partIdx);
            });
          });
        },
        prepareTimewise: function () {
          var measures = this.measures = [];
          this.walkCells(function (cell, measureIdx, partIdx) {
            measures[measureIdx] = measures[measureIdx] || [];
            var measure = measures[measureIdx];
            measure.parts = measure.parts || [];
            measure.parts[partIdx] = cell;
          });
        },
        toString: function () {
          return this.head + this.parts.map(function (part) {
            return part.toString();
          }).join('\n\n');
        }
      }
    },

    integers: {
      beatType: {
        enum: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
        default: 4
      }
    },

    objects: {
      scoreHead: {
        title: { type: 'string' },
        composer: { type: 'string' },
        isEmpty: function () {
          return !this.title && !this.composer;
        },
        toString: function () {
          return '              <<<' + this.title + '>>>          ' +
                 this.composer + '\n';
        }
      },

      part: {
        // head: { $ref: '#/objects/partHead' },
        measures: { $ref: '#/arrays/measures' },
        toString: function () {
          return this.measures.map(function (measure) {
            return measure.map(function (musicData) {
              return musicData.toString();
            }).join(' ');
          }).join(' ');
        }
      },

      // partHead: TO BE DEFINED!,

      pitch: {
        step: {
          type: 'integer',
          minimum: 1,
          maximum: 7,
          default: 1
        },
        octave: {
          type: 'integer',
          minimum: -5,
          maximum: 5,
          default: 0
        },
        accidental: {
          type: 'string',
          enum: ['#', 'b', '', 'n', '##', 'bb'],
          default: ''
        },
        midiNumber: {
          get: function () {
            return (this.octave + 5) * 12 +
              STEP_TO_MIDI_NUMBER[this.step] +
              (ACCIDENTAL_TO_ALTER[this.accidental] || 0);
          }
        },
        frequency: {
          get: function () {
            return A4_FREQUENCY * Math.pow(2, (this.midiNumber - A4_MIDI_NUMBER) / 12);
          }
        },
        defId: {
          get: function () {
            return ['p', this.accidental.replace(/#/g, 's'), this.step, this.octave].join('');
          }
        },
        toString: function () {
          return this.accidental + this.step + octaveString(this.octave);
        }
      },

      duration: {
        type: { $ref: '#/integers/beatType' },
        dot: {
          type: 'integer',
          minimum: 0,
          maximum: 2,
          default: 0
        },
        quarter: {
          get: function () {
            var d = 4 / this.type;
            return this.dot === 0 ? d :
                   this.dot === 1 ? d * 1.5 : d * 1.75;
          }
        },
        second: {
          get: function () {
            return this.quarter * 60 / TEMPO;
          }
        },
        underbar: {
          get: function () {
            return TYPE_TO_UNDERBAR[this.type] || 0;
          }
        },
        defId: {
          get: function () {
            return 'd' + this.type + this.dot;
          }
        },
        toString: function () {
          return TYPE_TO_STRING[this.type] + DOT_TO_STRING[this.dot];
        }
      }
    },

    namedObjects: {
      time: {
        beats: {
          type: 'integer',
          default: 4
        },
        beatType: { $ref: '#/integers/beatType' },
        toString: function () {
          return this.beats + '/' + this.beatType;
        },
        defId: {
          get: function () {
          return ['t', this.beats, '-', this.beatType].join('');
          }
        }
      },

      note: {
        pitch: { $ref: '#/objects/pitch' },
        duration: { $ref: '#/objects/duration' },
        slur: {
          type: 'array',
          items: {
            enum: ['begin', 'end']
          }
        },
        defId: {
          get: function () {
            var pitch = this.pitch, duration = this.duration;
            return [
              'n', pitch.accidental.replace(/#/g, 's'),
              pitch.step, pitch.octave, duration.type, duration.dot
            ].join('');
          }
        },
        toString: function () {
          return this.pitch + this.duration;
        }
      },

      rest: {
        duration: { $ref: '#/objects/duration' },
        defId: {
          get: function () {
            var duration = this.duration;
            return 'r' + duration.type + duration.dot;
          }
        },
        toString: function () {
          return '0' + this.duration;
        }
      },

      chord: {
        pitches: {
          type: 'array',
          items: { $ref: '#/objects/pitch' }
        },
        duration: { $ref: '#/objects/duration' },
        toString: function () {
          return '<' + this.pitches.map(function (pitch) {
            return pitch.toString();
          }).join('') + '>' + this.duration;
        }
      },

      // voice: {
      //   type: 'array',
      //   items: {
      //     oneOf: [
      //       { $ref: '#/namedObjects/note' },
      //       { $ref: '#/namedObjects/rest' },
      //       { $ref: '#/namedObjects/chord' },
      //     ]
      //   }
      // }

      bar: {
        type: 'string',
        enum: ['single', 'double', 'end', 'repeat-begin', 'repeat-end', 'repeat-both'],
        default: 'single',
        toString: function () {
          return BAR_TO_STRING[this.value];
        }
      }
    },

    arrays: {
      parts: { $ref: '#/objects/part' },
      measures: { $ref: '#/arrays/musicData' },
      musicData: [
        { $ref: '#/namedObjects/time' },
        { $ref: '#/namedObjects/note' },
        { $ref: '#/namedObjects/rest' },
        { $ref: '#/namedObjects/chord' },
        // { $ref: '#/namedObjects/voice' },
        { $ref: '#/namedObjects/bar' }
      ]
    }
  };

  musje.makeClasses(musje.model);

  /**
   * Usage:
   * var score = musje.score(JSONString or object);
   */
  musje.score = function (src) {
    if (typeof src === 'string') { src = JSON.parse(src); }
    return new musje.Score(src);
  };

}(musje));
