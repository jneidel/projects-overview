import rsa from "node-rsa";

/* global request */

window.encryptWithPubKey = async function encryptWithPubKey( password ) {
	const publicKeyFile = await request( "GET", "./public-key.pem" );
	const publicKey = new rsa();
	publicKey.importKey( publicKeyFile.body, "pkcs8-public-pem" );

	return publicKey.encrypt( password, "base64" );
};
