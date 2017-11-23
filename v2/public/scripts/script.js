/* eslint-disable no-alert */

/* Listening for item/title changes */
function ajaxUpdate( url ) {
    const request = new XMLHttpRequest();
    request.open( "POST", url, true );
    request.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded; charset=UTF-8" );
    request.addEventListener( "loadend", function requestLoad() {
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

function itemListener( item ) {
    let originalItem = item.value;
    item.addEventListener( "keydown", () => {
        console.log( "ok")
        if ( event.which === 13 ) {
            const parentNode = item.parentNode.parentNode.parentNode,
                titleNode = parentNode.children;

            if ( titleNode.length == 3 ) {
                var title = titleNode[1].value;
            } else {
                var title = titleNode[0].value;
            }

            ajaxUpdate( `http://localhost:8080/api/update?newItem=${item.value}&oldItem=${originalItem}&title=${title}` );
    
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
    
            ajaxUpdate( `http://localhost:8080/api/update?newTitle=${title.value}&title=${originalTitle}` );
    
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

function setNewCard( card ) {
    console.log(card)
    //setNewCardToInput( card );
}

for ( const card of cards ) {
    const classes = card.className;
    if ( !classes.match( /.addCardContainer/ ) ) {
        flipCard( card );
    } else {
        /* Add new card */
        card.addEventListener( "dblclick", function () {
            setNewCardToInput( this, arguments.callee );
        } );
    }
}

function setNewCardToInput( cardToBeSet, callingFunction ) {
    cardToBeSet.removeEventListener( "dblclick", callingFunction );
    cardToBeSet.className = "card";
    cardToBeSet.innerHTML = `
        <div class="front inner">
            <input type="text" placeholder="Add title" class="title">
                <ul>
                    <li>
                        <input type="text" placeholder="Add items" class="item">
                    </li>
                </ul>
        </div>
        <div class="back inner">
            <input type="text" placeholder="Add title" class="title"s>
                <ul>
                    <li>
                        <input type="text" placeholder="Add items" class="item">
                    </li>
                </ul>
        </div>
    `;
    
    for ( const item of cardToBeSet.children ) {
        itemListener( item.children[1].children[0].children[0] );
    }
    for ( const title of cardToBeSet.children ) {
        titleListener( title.children[0] );
    }

    flipCard( cardToBeSet );

    const content = document.getElementById( "content" ),
        newCard = content.appendChild( document.createElement( "span" ) );
    newCard.innerHTML += `<img class="addCard" src="img/add.png">`;
    newCard.className = "card addCardContainer";
    newCard.addEventListener( "dblclick", function setNewCard() {
        setNewCardToInput( this );
    } );
}
