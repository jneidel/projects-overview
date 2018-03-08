const axios = require( "axios" );
const marked = require( "marked" );

( async function renderMarkdown() {
  const md = await axios.get( "https://raw.githubusercontent.com/jneidel/projects-overview/master/README.md" );
  document.getElementById( "content" ).innerHTML = marked( md.data );
} )();
