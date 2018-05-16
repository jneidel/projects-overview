const path = require( "path" );
const webpack = require( "webpack" );
const { babel, polyfill, genScss, browserSync } = require( "setup-webpack" );

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

const sync = browserSync( 8000, 8080 );
const ttf = {
  test   : /\.(ttf)$/,
  exclude: /node_modules/,
  loader : "file-loader",
  options: {
    name: "../css/[name].[ext]",
  },
};

const results = [];

[ "app", "account", "login-register", "welcome", "help", "error" ].forEach( ( name ) => {
  const scss = genScss( `../css/${name}.bundle.css` );

  const entryPath = `./src/bundles/${name}.bundle.js`;
  const entry = prod ? polyfill( entryPath ) : entryPath;

  results.push( {
    mode  : prod ? "production" : "development",
    name  : `/${name}`, // For webpack console output
    entry,
    output: {
      path    : path.resolve( __dirname, "dist/js" ),
      filename: `${name}.bundle.js`,
    },
    module: {
      rules: prod ?
        [ babel, scss.rule, ttf ] :
        [ scss.rule, ttf ],
    },
    plugins: prod ?
      [ env, scss.plugin ] :
      [ env, scss.plugin ],
    optimization: {
      minimize : true,
      minimizer: [ scss.minimizer ],
    },
  } );
} );

module.exports = results;
