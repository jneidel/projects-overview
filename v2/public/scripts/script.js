const items = document.getElementsByClassName( "item" );

for ( let item of items ) {
    item.addEventListener( "keydown", async () => {
        if ( event.which === 13 ) {
            const parentNode = item.parentNode.parentNode.parentNode,
                title = parentNode.childNodes[0].innerHTML;
            
            console.log( `Saving ${item.value} to database of ${title}.` );
            // Send request to backend to change item database
        }
    } );
}

