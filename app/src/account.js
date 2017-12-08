import request from "then-request";

try { // POST login
    document.getElementById( "login" ).addEventListener( "click", async( event ) => {
        const username = document.getElementsByName( "username" )[0].value,
            password = document.getElementsByName( "password" )[0].value,
            token = await request( "POST", `http://localhost:8080/api/login?username=${username}&password=${password}` );
        localStorage.setItem( "token", token.body );
        window.location.replace( "http://localhost:8080/login" );
    } );
} catch ( error ) {}

try { // POST register
    document.getElementById( "register" ).addEventListener( "click", ( event ) => {
        console.log( localStorage.getItem( "token" ) );
    } );
} catch ( error ) {}
