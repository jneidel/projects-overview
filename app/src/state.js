import request from "then-request";
import rsa from "node-rsa";

/* global url parseJwt */
/* eslint-disable no-empty */

// Set global variables
/* eslint-disable */
window.url = "http://localhost:8080";

window.request = request;

window.parseJwt = function parseJwt( token ) {
    const base64Url = token.split( "." )[1];
    const base64 = base64Url.replace( "-", "+" ).replace( "_", "/" );
    return JSON.parse( window.atob( base64 ) );
};

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


// Handle login/register
async function accountHandler( func ) {
	try {
		const checkIfLoginOrRegister = document.getElementsByName( "username" )[0].value;
	} catch ( e ) {
		return null;
	}

	const publicKeyFile = await request( "GET", "./public-key.pem" );
	const publicKey = new rsa();
	publicKey.importKey( publicKeyFile.body, "pkcs8-public-pem" );

	function getFormData( isRegister = false ) {
		const data = {
			username: document.getElementsByName( "username" )[0].value,
			encrypt( password, isConfirmPass ) {
				password = publicKey.encrypt( password, "base64" );
				password = btoa( password );

				if ( isConfirmPass ) {
					this.password_confirm = password;
				} else {
					this.password = password;
				}
			},
		};

		data.encrypt( document.getElementsByName( "password" )[0].value, false );

		if ( isRegister ) {
			data.encrypt( document.getElementsByName( "password_confirm" )[0].value, true );
		}

		return data;
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
			const formData = getFormData();

			let response = await request( "POST", `${url}/api/login`, { json: {
				username: formData.username,
				password: formData.password,
			} } );
			response = JSON.parse( response.body );

			checkResponse( response, "login" );
		} );
	} catch ( e ) {}

	try {
		document.getElementById( "register" ).addEventListener( "click", async ( e ) => {
			const formData = getFormData( true );

			let response = await request( "POST", `${url}/api/register`, { json: {
				username        : formData.username,
				password        : formData.password,
				password_confirm: formData.password_confirm,
			} } );
			response = JSON.parse( response.body );

			checkResponse( response, "register" );
		} );
	} catch ( e ) {}
}
accountHandler();

// Display username in place of login/register
let token = localStorage.getItem( "token" );
if ( token ) {
	token = parseJwt( token );

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
