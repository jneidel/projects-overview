const jws = require( "jsonwebtoken" );
const fs = require( "mz/fs" );
const rsa = require( "node-rsa" );
const atob = require( "atob" );
const md5 = require( "md5" );

exports.decryptRegister = async ( req, res, next ) => {
	const privateKeyFile = await fs.readFile( "./private-key.pem" );
    const privateKey = new rsa();
    privateKey.importKey( privateKeyFile, "pkcs1-private-pem" );

	function decrypt( pass ) {
		pass = atob( pass );
    	pass = privateKey.decrypt( pass, "utf8" );
		pass = md5( pass );
		return pass;
	}

	req.body.password = decrypt( req.body.password );
	req.body.password_confirm = decrypt( req.body.password_confirm );
	
	return next();
}
