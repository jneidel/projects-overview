/* global encryptWithPubKey, url, axios, checkResponse */
/* eslint-disable no-empty */

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
    async encrypt( password, isConfirmPass = false ) {
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
    await data.encrypt( form.password_confirm, true );
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

  try {
    document.getElementById( "login" ).addEventListener( "click", async ( e ) => {
      const formData = await getFormData( {
        username: document.getElementsByName( "username" )[0].value,
        password: document.getElementsByName( "password" )[0].value,
      } );

      const response = await axios.post( "api/login", {
        username: formData.username,
        password: formData.password,
      } );
      checkResponse( response.data, "login" );
    } );
  } catch ( e ) {}

  try {
    document.getElementById( "register" ).addEventListener( "click", async ( e ) => {
      const formData = await getFormData( {
        username        : document.getElementsByName( "username" )[0].value,
        password        : document.getElementsByName( "password" )[0].value,
        password_confirm: document.getElementsByName( "password_confirm" )[0].value,
      } );

      const response = await axios.post( "api/register", {
        username        : formData.username,
        password        : formData.password,
        password_confirm: formData.password_confirm,
      } );
      checkResponse( response.data, "register" );
    } );
  } catch ( e ) {}
}
accountHandler();
