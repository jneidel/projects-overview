/* global encryptWithPubKey, url, axios, checkResponse */
/* eslint-disable no-empty */

async function getFormData( form ) {
  /* return data from form with encrypted passwords
   *
   * formData = { 
   *  username, 
   *  password,
   *  passwordConfirm
   * }
   */

  const data = {
    username: form.username,
    async encrypt( password, isConfirmPass = false ) {
      password = await encryptWithPubKey( password );

      if ( isConfirmPass ) {
        this.passwordConfirm = password;
      } else {
        this.password = password;
      }
    },
  };

  await data.encrypt( form.password );

  if ( form.passwordConfirm ) {
    await data.encrypt( form.passwordConfirm, true );
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
      checkResponse( response.data, "login", "app" );
    } );
  } catch ( e ) {}

  try {
    document.getElementById( "register" ).addEventListener( "click", async ( e ) => {
      const formData = await getFormData( {
        username       : document.getElementsByName( "username" )[0].value,
        password       : document.getElementsByName( "password" )[0].value,
        passwordConfirm: document.getElementsByName( "password_confirm" )[0].value,
      } );

      const response = await axios.post( "api/register", {
        username       : formData.username,
        password       : formData.password,
        passwordConfirm: formData.passwordConfirm,
      } );
      checkResponse( response.data, "register", "app" );
    } );
  } catch ( e ) {}
}
accountHandler();
