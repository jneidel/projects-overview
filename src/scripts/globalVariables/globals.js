/* 
 * Setting global variables to be shared across scripts.
 * 
 * Axios and encryptWithPubKey have been excluded because
 * of their size and will only be pulled in if needed.
 */ 

/* eslint-disable */
window.url = "http://localhost:8080";

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

window.checkResponse = ( res, errorRedirect ) => {
  if ( res.error ) {
    window.location.replace( `${url}/${errorRedirect}` );
  } else if ( res.success ) {
    window.location.replace( `${url}/app` );
  } else if ( res.info ) {
    window.location.reload();
  } else if ( res.state ) {
    window.location.replace( url + res.state );
  }
};
