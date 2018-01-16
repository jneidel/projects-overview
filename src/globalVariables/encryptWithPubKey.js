import rsa from "node-rsa";

/* global axios */

window.encryptWithPubKey = async function encryptWithPubKey( password ) {
  const publicKeyFile = await axios.get( "/public-key.pem" );
  const publicKey = new rsa();
  publicKey.importKey( publicKeyFile.data, "pkcs8-public-pem" );

  password = publicKey.encrypt( password, "base64" );
  password = btoa( password );

  return password;
};
