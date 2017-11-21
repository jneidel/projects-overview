const items = document.getElementsByClassName( "item" ),
    titles = document.getElementsByClassName( "title" );

for ( const item of items ) {
    let originalItem = item.value;
    item.addEventListener( "keydown", async() => {
        if ( event.which === 13 ) {
            const parentNode = item.parentNode.parentNode.parentNode,
                title = parentNode.childNodes[0].value;

            const request = new XMLHttpRequest();
            request.open( "POST", `http://localhost:8080/api?newItem=${item.value}&oldItem=${originalItem}&title=${title}`, true );
            request.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded; charset=UTF-8" );
            await request.send();

            originalItem = item.value;
        }
    } );
}

for ( const title of titles ) {
    let originalTitle = title.value;
    title.addEventListener( "keydown", async() => {
        if ( event.which === 13 ) {
            const request = new XMLHttpRequest();
            request.open( "POST", `http://localhost:8080/api?newTitle=${title.value}&title=${originalTitle}`, true );
            request.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded; charset=UTF-8" );
            await request.send();

            // if len > 17 alert that it will probably be cut off

            originalTitle = title.value;
        }
    } );
}
