const items = document.getElementsByClassName( "item" ),
    titles = document.getElementsByClassName( "title" );

async function ajax( url ) {
    const request = new XMLHttpRequest();
    request.open( "POST", url, true );
    request.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded; charset=UTF-8" );
    request.addEventListener( "loadend", function requestLoad( event ) {
        if ( this.status !== 200 ) {
            alert( "There was a error saving your data." );
        }
    } );
    request.timeout = 10000;
    request.ontimeout = () => {
        alert( "There was a timeout saving your data." );
    };
    await request.send();
}

for ( const item of items ) {
    let originalItem = item.value;
    item.addEventListener( "keydown", () => {
        if ( event.which === 13 ) {
            const parentNode = item.parentNode.parentNode.parentNode,
                title = parentNode.childNodes[0].value;

            ajax( `http://localhost:8080/api/update?newItem=${item.value}&oldItem=${originalItem}&title=${title}` );

            originalItem = item.value;
        }
    } );
}

for ( const title of titles ) {
    let originalTitle = title.value;
    title.addEventListener( "keydown", () => {
        if ( event.which === 13 ) {
            ajax( `http://localhost:8080/api/update?newTitle=${title.value}&title=${originalTitle}` );

            // if len > 17 alert that it will probably be cut off

            originalTitle = title.value;
        }
    } );
}
