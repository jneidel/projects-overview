import request from "then-request";
import jwt from "jsonwebtoken";
import rsa from "node-rsa";

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

        const token = await request( "POST", `http://localhost:8080/api/login?username=${username}&password=${password}` );
        localStorage.setItem( "token", token.body );
        window.location.replace( "http://localhost:8080/login" );
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
    document.getElementById( "nav-right" ).innerHTML = `
        <div class="nav-container">
            <a href="#" class="nav-username">${token.username}</a>
            <div class="header-underline"></div>
        </div>
    `;

    // Underline hover
    const username = document.getElementsByClassName( "nav-username" )[0];
    const underline = username.parentElement.childNodes[3].style;

    underline.maxWidth = "0";
    underline.height = "3px";
    underline.background = "#F5F7FA";
    underline.transition = "max-width 0.2s ease-in-out";
    username.style.margin = "0";

    username.addEventListener( "mouseover", ( e ) => {
        underline.maxWidth = "80%";
    } );
    username.addEventListener( "mouseleave", ( e ) => {
        underline.maxWidth = "0";
    } );
}
