/* eslint-disable no-tabs */

const webpack = require( "webpack" );
const pathModule = require( "path" );
const minify = require( "babel-minify-webpack-plugin" );

require( "dotenv" ).config( { path: "variables.env" } );
const prod = process.env.PROD || false;

const config = { // common config
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

const path = pathModule.resolve( __dirname, "public/scripts" );

const app = Object.assign( {}, config, {
  name: "/app",
  entry: "./src/scripts/bundles/app.bundle.js",
  output: {
    path, filename: "app.bundle.js",
  },
} );

const account = Object.assign( {}, config, {
  name: "/account",
  entry: "./src/scripts/bundles/account.bundle.js",
  output: {
    path, filename: "account.bundle.js"
  },
} );

const loginRegister = Object.assign( {}, config, {
  name: "/login/register",
  entry: "./src/scripts/bundles/loginRegister.bundle.js",
  output: {
    path, filename: "loginRegister.bundle.js"
  },
} );

const welcome = Object.assign( {}, config, {
  name: "/",
  entry: "./src/scripts/bundles/welcome.bundle.js",
  output: {
    path, filename: "welcome.bundle.js"
  },
} );

module.exports = [
  app, account, loginRegister, welcome
];
