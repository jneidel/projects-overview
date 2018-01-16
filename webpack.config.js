/* eslint-disable no-tabs */

const path = require( "path" );
const minify = require( "babel-minify-webpack-plugin" );
const webpack = require( "webpack" );

require( "dotenv" ).config( { path: "variables.env" } );
const prod = process.env.PROD || false;

module.exports = {
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
        presets: [ "@babel/preset-env" ],
      },
    } ),
  ] : [],
};
