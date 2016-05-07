'use strict';

module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname,
    filename: 'musje.js',
    libraryTarget: 'umd',
    library: 'musje'
  },
  externals: {
    Snap: 'Snap',
    MIDI: 'MIDI'
  },
  module: {
    loaders: [
      { test: /\.jison$/, loader: './parser/jison-loader' }
    ]
  },
  plugins: []
};
