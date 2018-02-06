/* global checkResponse axios encryptWithPubKey url $ */

const registerListener = {
  username: async ( event ) => {
    const username = document.getElementsByName( "username" )[0].value;
    let password = document.getElementsByName( "username_confirm" )[0].value;

    password = await encryptWithPubKey( password );

    const response = await axios.post( "api/update-username", { newUsername: username, password } );
    checkResponse( response.data, "account" );
  },
};

document.getElementsByName( "username_button" )[0].addEventListener( "click", registerListener.username );
document.getElementsByName( "username_confirm" )[0].addEventListener( "keydown", () => {
  if ( event.which === 13 ) { registerListener.username(); }
} );
document.getElementsByName( "username" )[0].addEventListener( "keydown", () => {
  if ( event.which === 13 ) { registerListener.username(); }
} );
