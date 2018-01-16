/* global checkResponse axios encryptWithPubKey url $ */

const setListener = {
  username: async ( event ) => {
    const username = document.getElementsByName( "username" )[0].value;
    let password = document.getElementsByName( "confirmation_username" )[0].value;

    if ( event.which === 13 && username && password ) {
      password = await encryptWithPubKey( password );

      const response = await axios.post( "/api/update-username", { newUsername: username, password } );
      checkResponse( response.data, "account" );
    }
  },
};

// Change username
document.getElementsByName( "confirmation_username" )[0].addEventListener( "keydown", setListener.username );
