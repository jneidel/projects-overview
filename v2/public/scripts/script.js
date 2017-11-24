/* eslint-disable no-alert */

/* Database Requests */
const database = {
    request( url, method, errorMsg, card = null, newCardHandler = null ) {
        const request = new XMLHttpRequest();
        request.open( method, url, true );
        request.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded; charset=UTF-8" );
        request.addEventListener( "loadend", function requestLoad() {
            if ( newCardHandler && card ) { // New card handler
                console.log("triggered")
                newCardHandler( request.response, card );
            } else {
                if ( this.status !== 200 ) {
                    alert( "There was a error " + errorMsg );
                }
            }
        } );
        request.timeout = 10000;
        request.ontimeout = () => {
            alert( "There was a timeout " + errorMsg );
        };
        request.send();
    },
    update( url ) {
        this.request(
            url,
            "POST",
            "saving your data."
        );
    },
    addNewCard( url, card ) {
        this.request(
            url,
            "GET",
            "adding the new card.",
            card,
            function ( res, card ) {
                function trim( str ) {
                    return str.replace( /}/, "" );
                }
                const cardId = trim( res.slice( 7 ) );
                card.id = cardId;
            }
        );
    }
}

/* Listening for item/title changes */
function itemListener( item ) {
    let originalItem = item.value;
    item.addEventListener( "keydown", () => {
        if ( event.which === 13 ) {
            const parentNode = item.parentNode.parentNode.parentNode,
                titleNode = parentNode.children;

            if ( titleNode.length == 3 ) {
                var title = titleNode[1].value;
            } else {
                var title = titleNode[0].value;
            }

            database.update( `http://localhost:8080/api/update?newItem=${item.value}&oldItem=${originalItem}&title=${title}` );
    
            originalItem = item.value;
        }
    } );
}

function titleListener( title ) {
    let originalTitle = title.value;
    title.addEventListener( "keydown", () => {
        if ( event.which === 13 ) {
            if ( title.value.length >= 20 ) {
                alert( `The title "${title.value}" will probably be cut off as its too long.
                        ${title.value.length}` );
            }

            const parent = title.parentNode.parentNode.children;
            if ( !title.parentNode.className.match( /back/ ) ) {
                parent[1].children[1].value = title.value;
            } else {
                parent[0].children[0].value = title.value;
            }
    
            database.update( `http://localhost:8080/api/update?newTitle=${title.value}&title=${originalTitle}` );
    
            originalTitle = title.value;
        }
    } );
}

const items = document.getElementsByClassName( "item" ),
    titles = document.getElementsByClassName( "title" );

for ( const item of items ) {
    itemListener( item );
}

for ( const title of titles ) {
    titleListener( title );
}

/* Flip cards */
const cards = document.getElementsByClassName( "card" );

function flipCard( card ) {
    let cardState = "front";
    card.addEventListener( "dblclick", () => {
        if ( cardState === "front" ) {
            card.style.transform = "rotateY( 180deg )";
            cardState = "back";
        } else {
            card.style.transform = "rotateY( 0deg )";
            cardState = "front";
        }
    } );
}

for ( const card of cards ) {
    const classes = card.className;
    if ( !classes.match( /.addCardContainer/ ) ) {
        flipCard( card );
    } else {
        card.addEventListener( "dblclick", function () {
            setNewCardToInput( this, arguments.callee );
        } );
    }
}

/* Add new card */
async function setNewCardToInput( cardToBeSet, callingFunction ) {
    cardToBeSet.removeEventListener( "dblclick", callingFunction );
    cardToBeSet.className = "card";
    cardToBeSet.innerHTML = `
        <div class="front inner">
            <input class="title" type="text" placeholder="Add title">
                <ul>
                    <li>
                        <input class="item" type="text" placeholder="Add items">
                    </li>
                </ul>
        </div>
        <div class="back inner">
            <p class="future">Future</p> 
            <input class="title" type="text" placeholder="Add title">
                <ul>
                    <li>
                        <input class="item" type="text" placeholder="Add items">
                    </li>
                </ul>
        </div>
    `;
    
    for ( const item of cardToBeSet.children ) {
        if ( item.children.length == 3 ) {
            itemListener( item.children[2].children[0].children[0] );
        } else {
            itemListener( item.children[1].children[0].children[0] );
        }
    }
    for ( const title of cardToBeSet.children ) {
        titleListener( title.children[0] );
    }

    flipCard( cardToBeSet );

    const content = document.getElementById( "content" ),
        newCard = content.appendChild( document.createElement( "span" ) );
    newCard.innerHTML += `<img class="addCard" src="img/add.png">`;
    newCard.className = "card addCardContainer";
    newCard.addEventListener( "dblclick", function () {
        setNewCardToInput( this, arguments.callee );
    } );

    database.addNewCard( `http://localhost:8080/api/generate-userid`, cardToBeSet );
    
}
