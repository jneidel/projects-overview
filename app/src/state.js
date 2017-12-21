/* global axios url encryptWithPubKey */
/* eslint-disable no-empty */

// Set global variables
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
/* eslint-enable */

async function getFormData( form ) {
  /* return data from form with encrypted passwords
   *
   * formData = { 
   *  username, 
   *  password,
   *  password_confirm
   * }
   */

  const data = {
    username: form.username,
    encrypt: async function( password, isConfirmPass = false ) {
      password = await encryptWithPubKey( password );

      if ( isConfirmPass ) {
        this.password_confirm = password;
      } else {
        this.password = password;
      }
    },
  };

  await data.encrypt( form.password );

  if ( form.password_confirm ) {
    await data.encrypt( form.password_confirm );
  }

  return data;
}

// Handle login/register
async function accountHandler( func ) {
  try {
    const checkIfLoginOrRegister = document.getElementsByName( "username" )[0].value;
  } catch ( e ) {
    return null;
  }

  function checkResponse( res, errorRedirect ) {
    if ( res.error ) {
      window.location.replace( `${url}/${errorRedirect}` );
    }
    if ( res.token ) {
      localStorage.setItem( "token", res.token );
      window.location.replace( `${url}/app` );
    }
  }

  try {
    document.getElementById( "login" ).addEventListener( "click", async ( e ) => {
      const formData = await getFormData( {
        username: document.getElementsByName( "username" )[0].value,
        password: document.getElementsByName( "password" )[0].value,
      } );

      const response = await axios.post( "/api/login", {
        username: formData.username,
        password: formData.password,
      } );
      checkResponse( response.data, "login" );
    } );
  } catch ( e ) {}

  try {
    document.getElementById( "register" ).addEventListener( "click", async ( e ) => {
      const formData = await getFormData( {
        username: document.getElementsByName( "username" )[0].value,
        password: document.getElementsByName( "password" )[0].value, 
        password_confirm: document.getElementsByName( "password_confirm" )[0].value,
      } );

      const response = await axios.post( "/api/register", {
        username        : formData.username,
        password        : formData.password,
        password_confirm: formData.password_confirm,
      } );
      checkResponse( response.data, "register" );
    } );
  } catch ( e ) {}
}
accountHandler();

// Display username in place of login/register
let token = localStorage.getItem( "token" );
if ( token ) {
  const base64Url = token.split( "." )[1];
  const base64 = base64Url.replace( "-", "+" ).replace( "_", "/" );
  token = JSON.parse( window.atob( base64 ) );

  let username = token.username;
  if ( username.length > 20 ) {
    username = username.slice( 0, 20 );
  }

  document.getElementById( "nav-right" ).innerHTML = `
        <div class="nav-container">
            <a href="/account" class="nav-username">${username}</a>
            <div class="header-underline"></div>
		</div>
		<div class="nav-container">
			<a href="/logout">
				<img class="logout-icon" src="/img/logout.png">	
			</a>
		</div>
    `;

  // Underline hover
  const usernameElem = document.getElementsByClassName( "nav-username" )[0];
  const underlineElem = usernameElem.parentElement.childNodes[3].style;

  underlineElem.maxWidth = "0";
  underlineElem.height = "3px";
  underlineElem.background = "#F5F7FA";
  underlineElem.transition = "max-width 0.2s ease-in-out";
  usernameElem.style.margin = "0";

  usernameElem.addEventListener( "mouseover", ( e ) => {
    underlineElem.maxWidth = "100%";
  } );
  usernameElem.addEventListener( "mouseleave", ( e ) => {
    underlineElem.maxWidth = "0";
  } );

  document.getElementsByClassName( "header-link-home" )[0].href = "/app";
}

exports.getFormData = getFormData;