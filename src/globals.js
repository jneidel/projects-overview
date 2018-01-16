// Setting global variables to be shared across scripts

/* eslint-disable */
window.url = "http://localhost:8080";

window.axios = require( "axios" );

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
