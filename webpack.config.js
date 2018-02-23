/* eslint-disable no-tabs */

const webpack = require( "webpack" );
const pathModule = require( "path" );
const minifyModule = require( "babel-minify-webpack-plugin" );
const ExtractTextPlugin = require( "extract-text-webpack-plugin" );
const browserSyncPlugin = require( "browser-sync-webpack-plugin" );

require( "dotenv" ).config( { path: "variables.env" } );

const prod = process.env.NODE_ENV === "prod" ? true : false;

/* loaders */
const scss = {
  test  : /\.scss$/,
  loader: ExtractTextPlugin.extract( "raw-loader!sass-loader" ),
};

const babel = {
  test: /\.js$/,
  use : [ {
    loader : "babel-loader",
    options: {
      presets: [ "babel-preset-env" ],
      plugins: [ [ "babel-plugin-transform-runtime", {
        helpers    : false,
        polyfill   : true,
        regenerator: true,
        moduleName : "babel-runtime",
      } ] ],
    },
  } ],
};

/* plugins */
const uglify = new webpack.optimize.UglifyJsPlugin( {
  compress: { warnings: false },
} );

const minify = new minifyModule( {}, { comments: false } );

const browserSync = new browserSyncPlugin( {
  host : "localhost",
  port : 8080,
  proxy: "http://localhost:8000/",
}, {} );

function bundleCss( out ) {
  return new ExtractTextPlugin( `../styles/${out}.bundle.css` );
}

const env = new webpack.DefinePlugin( { // Makes .env vars available in client side scripts
  env: {
    URL: JSON.stringify( process.env.URL ),
  },
} );

/* Set module */
const config = { // common config
  module: {
    loaders: prod ?
      [ /* babel, */ scss ] :
      [ scss ],
  },
};

/* Set entry, output, plugins */
const path = pathModule.resolve( __dirname, "public/scripts" );
const res = [];

[ "app", "account", "loginRegister", "welcome", "help" ].forEach( ( name ) => {
  res.push( Object.assign( {}, config, { // Combine config and new obj
    name  : `/${name}`,
    entry : `./src/bundles/${name}.bundle.js`,
    output: {
      path, filename: `${name}.bundle.js`,
    },
    plugins: prod ?
      [ env, minify, uglify, bundleCss( name ) ] :
      [ env, bundleCss( name ), browserSync ],
  } ) );
} );

module.exports = res;
