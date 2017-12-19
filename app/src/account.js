/* global Vue */

function renderAccount() {
  // get data

  ( function createVue() {
    try {
      var app = new Vue( {
        el  : "#settings",
        data: {
          username: "jneidel",
        },
      } );
    } catch ( e ) {
      setTimeout( createVue, 100 );
    }
  } )();
}

renderAccount();
