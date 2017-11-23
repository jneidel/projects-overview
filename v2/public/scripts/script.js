"use strict";

/* Listening for item/title changes */

const items = document.getElementsByClassName( "item" ),
    titles = document.getElementsByClassName( "title" );

function ajaxUpdate( url ) {
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
    request.send();
}

for ( const item of items ) {
    let originalItem = item.value;
    item.addEventListener( "keydown", () => {
        if ( event.which === 13 ) {
            const parentNode = item.parentNode.parentNode.parentNode,
                title = parentNode.childNodes[0].value;

            ajaxUpdate( `http://localhost:8080/api/update?newItem=${item.value}&oldItem=${originalItem}&title=${title}` );

            originalItem = item.value;
        }
    } );
}

for ( const title of titles ) {
    let originalTitle = title.value;
    title.addEventListener( "keydown", () => {
        if ( event.which === 13 ) {
            if ( title.value.length >= 20 ) {
                alert( `The title "${title.value}" will probably be cut off as its too long.
                        ${title.value.length}` );
            }

            ajaxUpdate( `http://localhost:8080/api/update?newTitle=${title.value}&title=${originalTitle}` );

            originalTitle = title.value;
        }
    } );
}

/* Flip cards */

const cards = document.getElementsByClassName( "card" );
let cardState = "front";

for ( const card of cards ) {
    const classes = card.className;
    if ( !classes.match( /.addCardContainer/ ) ) {
        card.addEventListener( "dblclick", () => {
            if ( cardState === "front" ) {
                card.style.transform = "rotateY( 180deg )";
                cardState = "back";
            } else {
                card.style.transform = "rotateY( 0deg )";
                cardState = "front";
            }
        } );
    } else {
        // Todo: add empty new card template
    }
}
