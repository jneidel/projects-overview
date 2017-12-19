import rsa from "node-rsa";

/* global axios */

window.encryptWithPubKey = async function encryptWithPubKey( password ) {
  const publicKeyFile = await axios.get( "/public-key.pem" );
  const publicKey = new rsa();
  publicKey.importKey( publicKeyFile.data, "pkcs8-public-pem" );

  return publicKey.encrypt( password, "base64" );
};
