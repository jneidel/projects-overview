/* global Vue axios encryptWithPubKey url */

const token = localStorage.getItem( "token" );

if ( !token ) {
  window.location.replace( `${url}/login` );
}

async function renderAccount() {
  const accountDataRequest = await axios.post( "/api/account-data", { token } );
  const accountData = accountDataRequest.data;

  if ( accountData.error ) {
    window.location.replace( `${url}/logout?unverified=true` );
  }

  ( function createVue() {
    try {
      var app = new Vue( {
        el  : "#settings",
        data: {
          username: accountData.username,
        },
      } );
    } catch ( e ) {
      setTimeout( createVue, 100 );
    }
  } )();
}

const setListener = {
  async username( event ) {
    const username = document.getElementsByName( "username" )[0].value;
    let password = document.getElementsByName( "confirmation_username" )[0].value;

    if ( event.which === 13 && username && password ) {
      password = await encryptWithPubKey( password );

      const response = await axios.post( "/api/update-username", {
        token,
        newUsername: username,
        password,
      } );

      if ( response.data && response.data.token ) {
        localStorage.setItem( "token", response.data.token );
        window.location.replace( `${url}/account` );
      }
    }
  },
};

function setEventListeners() {
  // Change username
  document.getElementsByName( "confirmation_username" )[0].addEventListener( "keydown", setListener.username );
  // Submit button listener
}

( async function main() { // listeners will only work when set after vue
  await renderAccount();
  setEventListeners();
} )();
