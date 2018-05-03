/* 
 * Setting global variables to be shared across scripts.
 * 
 * Axios and encryptWithPubKey have been excluded because
 * of their size and will only be pulled in if needed.
 */ 
/* eslint-disable */

window.url = env.URL; // URL from var.env processed through webpack

// bling.js
window.$ = document.querySelectorAll.bind( document );
Node.prototype.on = window.on = function( name, fn ) {
  this.addEventListener( name, fn );
};
NodeList.prototype.__proto__ = Array.prototype;
NodeList.prototype.on = NodeList.prototype.addEventListener = function( name, fn ) {
  this.forEach( ( elem, i ) => {
    elem.on( name, fn );
  } );
};

window.checkResponse = ( res, errorRedirect, successRedirect = null ) => {
  if ( res.error ) {
    window.location.replace( `${url}/${errorRedirect}` );
  } else if ( res.success ) {
    if ( successRedirect ) { window.location.replace( `${url}/${successRedirect}` ); }
  } else if ( res.info ) {
    window.location.reload();
  } else if ( res.state ) {
    window.location.replace( url + res.state );
  } else {
    return res;
  }
};

function readFile( blob ) {
  return new Promise( ( resolve, reject ) => {
    var reader = new FileReader();
    reader.onload = () => {
      resolve( reader.result );
    };
    reader.readAsText( blob );
  } );
}

window.axios = {
  get: url =>
    fetch( url, { method: "GET" } )
      .then( response => response.blob() )
      .then( blob => readFile( blob ) ),
  post: ( url, body ) =>
    fetch( url, {
      method : "POST",
      body   : JSON.stringify( body ),
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    } ),
};
