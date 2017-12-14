import request from "then-request";
import jwt from "jsonwebtoken";
import rsa from "node-rsa";

/* eslint-disable no-empty */

const url = "http://localhost:8080";

function parseJwt( token ) {
    const base64Url = token.split( "." )[1];
    const base64 = base64Url.replace( "-", "+" ).replace( "_", "/" );
    return JSON.parse( window.atob( base64 ) );
}

try { // POST login
    document.getElementById( "login" ).addEventListener( "click", async ( e ) => {
        const publicKeyFile = await request( "GET", "./public-key.pem" );
        const publicKey = new rsa();
        publicKey.importKey( publicKeyFile.body, "pkcs8-public-pem" );

        const username = document.getElementsByName( "username" )[0].value;
        let password = document.getElementsByName( "password" )[0].value;
        password = publicKey.encrypt( password, "base64" );
        password = btoa( password );

        const token = await request( "POST", `${url}/api/login?username=${username}&password=${password}` );
        localStorage.setItem( "token", token.body );
        window.location.replace( `${url}/` );
    } );
} catch ( error ) {} // Not on login page 

try { // POST register
    document.getElementById( "register" ).addEventListener( "click", ( e ) => {
    } );
} catch ( error ) {} // Not on register page

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
}
