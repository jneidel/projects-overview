const items = document.getElementsByClassName( "item" ),
    titles = document.getElementsByClassName( "title" );

for ( let item of items ) {
    let originalItem = item.value;
    item.addEventListener( "keydown", async () => {
        if ( event.which === 13 ) {
            const parentNode = item.parentNode.parentNode.parentNode,
                title = parentNode.childNodes[0].value;
            
            console.log( `New item: ${item.value} --- Old item: ${originalItem} --- Title: ${title}` );
            // Send request to backend to change item database

            originalItem = item.value;
        }
    } );
}

for ( let title of titles ) {
    let originalTitle = title.value;
    title.addEventListener( "keydown", async () => {
        if ( event.which === 13 ) {

            console.log( `New title: ${title.value} --- Old title: ${originalTitle} --- Title: ${originalTitle}`)
            
            // send ogTitle along on db request
            // if len > 17 alert that it will probably be cut off

            originalTitle = title.value;
        }
    } );
}

