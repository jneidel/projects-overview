/* eslint-disable no-tabs */

const webpack = require( "webpack" );
const pathModule = require( "path" );
const minifyModule = require( "babel-minify-webpack-plugin" );
const ExtractTextPlugin = require( "extract-text-webpack-plugin" );

require( "dotenv" ).config( { path: "variables.env" } );
const prod = process.env.PROD || false;

/* loaders */
const scss = {
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract( "raw-loader!sass-loader" ),
};

const babel = {
  test: /\.js$/,
  use : [ {
    loader: "babel-loader",
    options: { presets: [ "babel-preset-env" ] },
  } ],
};

/* plugins */
const uglify = new webpack.optimize.UglifyJsPlugin( {
  compress: { warnings: false }
} );

const minify = new minifyModule( {}, { comments: false } );

function bundleCss( out ) {
  return new ExtractTextPlugin( `../styles/${out}.bundle.css` );
};

/* Set module */
const config = { // common config
  module: {
    loaders: prod ?
      [ babel, scss ] :
      [ scss ]
  },
}

/* Set entry, output, plugins */
const path = pathModule.resolve( __dirname, "public/scripts" );
const res = [];

[ "app", "account", "loginRegister", "welcome" ].forEach( ( name ) => {
  res.push( Object.assign( {}, config, { // Combine config and new obj
    name: `/${name}`,
    entry: `./src/bundles/${name}.bundle.js`,
    output: {
      path, filename: `${name}.bundle.js`,
    },
    plugins: prod ?
      [ minify, uglify, bundleCss( name ) ] :
      [ bundleCss( name ) ]
  } ) );
} );

module.exports = res;
