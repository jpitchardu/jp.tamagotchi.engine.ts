var path = require('path');

module.exports = {
  target: 'node',
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        // Include ts, tsx, and js files.
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: 'ts-loader'
      }
    ]
  }
};
