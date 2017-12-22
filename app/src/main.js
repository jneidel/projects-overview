/* globals Vue url axios */
/* eslint-disable no-alert */
/* url, $, axios, globally set in state.js */

const token = localStorage.getItem( "token" );
if ( !token ) {
  window.location.replace( `${url}/login` );
}

// Render cards from database
async function drawItems() {
  const cardsRequest = await axios.post( "/api/getitems", { token } );
  const cards = cardsRequest.data;

  if ( cards.error ) {
    window.location.replace( `${url}/logout?unverified=true` );
  }

  function createVue() {
    try {
      var vue = new Vue( {
        el  : "#cards",
        data: {
          cards,
        },
      } );
    } catch ( e ) {
      setTimeout( createVue, 100 );
    }
  }
  createVue();
}

// Listening for item/title changes

const setListener = {
  item( item ) {
    let originalItem = item.value;

    item.addEventListener( "keydown", async () => {
      if ( event.which === 13 ) {
        const parentNode = item.parentNode.parentNode.parentNode;
        const titleNode = parentNode.children;
        let cardSide;

        if ( parentNode.className.match( /back/ ) === null ) {
          cardSide = "front";
        } else {
          cardSide = "back";
        }

        if ( titleNode.length == 3 ) {
          var title = titleNode[1].value;
          var lastItem = parentNode.children[2].children[parentNode.children[2].children.length - 1].children[0];
        } else {
          var title = titleNode[0].value;
          var lastItem = titleNode[1].children[titleNode[1].children.length - 1].children[0];
        }
        
        if ( lastItem === item ) {
          axios.post( "/api/add-new-item", {
            token,
            cardSide,
            title,
          } );
          
          if ( titleNode.length == 3 ) {
            var newItemWrapper = parentNode.children[2].appendChild( document.createElement( "li" ) );
          } else {
            var newItemWrapper = parentNode.children[1].appendChild( document.createElement( "li" ) );
          }
          const newItem = newItemWrapper.appendChild( document.createElement( "input" ) );
          newItem.type = "text";
          newItem.classes = "item";

          setListener.item( newItem );
        }

        await axios.post( "/api/update", {
          token,
          updatedItem: item.value,
          oldItem    : originalItem,
          cardSide,
          title,
        } );

        originalItem = item.value;
	 		}
    } );
  },
  title( title ) {
    let originalTitle = title.value;

    title.addEventListener( "keydown", async () => {
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

        await axios.post( "/api/update", {
          token,
          updatedTitle: title.value,
          title       : originalTitle,
        } );

        originalTitle = title.value;
      }
    } );
  },
};

function setEventListeners() {
  const items = document.getElementsByClassName( "item" );
  const titles = document.getElementsByClassName( "title" );

  for ( const item of items ) {
	    setListener.item( item );
  }

  for ( const title of titles ) {
	    setListener.title( title );
  }

  const cards = document.getElementsByClassName( "card" );

  // flip cards
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

  // Add new card
  const cardListenerCallback = function cardListenerCallbackWrapper() {
    setNewCardToInput( this, cardListenerCallback );
  };

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
        setListener.item( item.children[2].children[0].children[0] );
      } else {
        setListener.item( item.children[1].children[0].children[0] );
      }
    }

    for ( const title of cardToBeSet.children ) {
      setListener.title( title.children[0] );
    }

    flipCard( cardToBeSet );

    const content = document.getElementById( "cards" );
    const newCard = content.appendChild( document.createElement( "span" ) );

    newCard.innerHTML += `<img class="addCard" src="img/add.png">`;
    newCard.className = "card addCardContainer";
    newCard.addEventListener( "dblclick", cardListenerCallback );

    const cardIdRequest = await axios.post( "/api/generate-cardId", { token } );
    const cardId = cardIdRequest.data._id;

    axios.post( "/api/add-new-card", {
      token,
      _id: cardId,
    } );
  }

  for ( const card of cards ) {
    const classes = card.className;
    if ( !classes.match( /.addCardContainer/ ) ) {
      flipCard( card );
    } else {
      card.addEventListener( "dblclick", cardListenerCallback );
    }
  }
}

( async function main() { // to ensure drawing items before setting listeners
  await drawItems();
  setEventListeners();
} )();
