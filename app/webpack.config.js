/* eslint-disable no-tabs */

const path = require( "path" );
const minify = require( "babel-minify-webpack-plugin" );

require( "dotenv" ).config( { path: "variables.env" } );
const prod = process.env.PROD || false;

module.exports = {
	entry: {
		main   : "./src/main.js",
		account: "./src/account.js",
	},
	output: {
		filename: "[name].js",
		path    : path.resolve( __dirname, "public/scripts" ),
	},
	plugins: prod ? [
		new minify( {}, { comments: false } )
	] : []
};
