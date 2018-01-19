/* eslint-disable no-tabs */

const webpack = require( "webpack" );
const path = require( "path" );
const minify = require( "babel-minify-webpack-plugin" );

require( "dotenv" ).config( { path: "variables.env" } );
const prod = process.env.PROD || false;

module.exports = {
  entry: {
    accountHandler      : "./src/scripts/accountHandler.js",
    appClickHandler     : "./src/scripts/appClickHandler.js",
    axios               : "./src/scripts/globalVariables/axios.js",
    encryptWithPubKey   : "./src/scripts/globalVariables/encryptWithPubKey.js",
    globals             : "./src/scripts/globalVariables/globals.js",
    loginRegisterHandler: "./src/scripts/loginRegisterHandler.js",
  },
  output: {
    path: path.resolve( __dirname, "public/scripts/" ),
    filename: "[name].js"
  },
  module: {
    loaders: prod ? [
      {
        test: /\.js$/,
        use : [ {
          loader: "babel-loader",
          options: { presets: [ "babel-preset-env" ] },
        } ],
      },
    ] : [],
  },
  plugins: prod ? [
    new minify( {}, { comments: false } ),
    new webpack.optimize.UglifyJsPlugin( {
      compress: { warnings: false }
    } ),
  ] : [],
}


const old = {
  entry: {
    accountHandler      : "./src/accountHandler.js",
    appClickHandler     : "./src/appClickHandler.js",
    axios               : "./src/globalVariables/axios.js",
    encryptWithPubKey   : "./src/globalVariables/encryptWithPubKey.js",
    globals             : "./src/globalVariables/globals.js",
    loginRegisterHandler: "./src/loginRegisterHandler.js",
  },
  output: {
    filename: "[name].js",
    path    : path.resolve( __dirname, "public/scripts" ),
  },
  plugins: prod ? [
    new minify( {}, { comments: false } ),
    new webpack.LoaderOptionsPlugin( {
      test   : /\.js/,
      options: {
        loaders: [ "babel-loader" ],
        presets: [ "babel-preset-env" ],
      },
    } ),
  ] : [],
};
