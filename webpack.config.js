const path = require('path');

module.exports = {
  entry: {
    main: './tilt/src/index.js'
  },
  output: {
    path: path.join(__dirname, '/static/'),
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      { // use babel-loader to load js files
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
        
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      { // load images
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      { // load fonts
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ]
  }
};