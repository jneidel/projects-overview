const path = require( "path" );
const webpack = require( "webpack" );
const { babel, polyfill, uglify, genScss, browserSync } = require( "setup-webpack" );

/*
   See https://github.com/jneidel/setup-webpack for an in-depth explaination of how this works.
*/

require( "dotenv" ).config( { path: "variables.env" } );

const prod = process.env.NODE_ENV === "prod";

const env = new webpack.DefinePlugin( { // Makes .env vars available in client side scripts
  env: {
    URL: JSON.stringify( process.env.URL ),
  },
} );

const sync = browserSync();

const results = [];

[ "app", "account", "loginRegister", "welcome", "help" ].forEach( ( name ) => {
  const scss = genScss( `../styles/${name}.bundle.css` );

  const entryPath = `./src/bundles/${name}.bundle.js`;
  const entry = prod ? polyfill( entryPath ) : entryPath;

  results.push( {
    name  : `/${name}`, // For webpack console output
    entry,
    output: {
      path    : path.resolve( __dirname, "public/scripts" ),
      filename: `${name}.bundle.js`,
    },
    module: {
      loaders: prod ?
        [ babel, scss.loader ] :
        [ scss.loader ],
    },
    plugins: prod ?
      [ env, uglify, scss.plugin ] :
      [ env, scss.plugin, sync ],
  } );
} );

module.exports = results;
