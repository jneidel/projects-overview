/* eslint-disable no-tabs */

const path = require( "path" );

module.exports = {
	entry: {
		main   : "./src/main.js",
		account: "./src/account.js",
	},
	output: {
		filename: "[name].js",
		path    : path.resolve( __dirname, "public/scripts" ),
	},
};
