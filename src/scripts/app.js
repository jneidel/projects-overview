/* globals Vue url axios $ checkResponse */
/* eslint-disable no-alert */

/* Visual DOM Selection Tree - always applies to the one above
 *>div.item      // > signifies entry point item
 *  span.class
 *<   p.2ndChild // < signifies out point item
 */

// Listening for item/title changes
const setListener = {
  item( item ) {
    let originalItem = item.value;

    item.addEventListener( "keydown", async () => {
      if ( event.which === 13 ) {
        const innerCard = item.parentNode.parentNode.parentNode;
        /*
         *<div.inner
         *  ul
         *    li
         *>     input.item
         */
        const side = innerCard.className.match( /back/ ) ? "back" : "front";
        const ul = side === "back" ? innerCard.children[2] : innerCard.children[1];
        /*
         *>div.inner(.front/.back)
         *  (p.future)
         *  input.title
         *< ul
         */
        const title = side === "back" ?
          innerCard.children[1].value :
          innerCard.children[0].value;
        /*
         *>div.inner(.front/.back)
         *  (p.future)
         *< input.title
         */
        const lastItem = ul[ul.length - 1].children[1];
        /*
         *>ul
         *  li
         *< li [-1]
         */

        if ( lastItem === item ) {
          axios.post( "/api/add-new-item", { side, title } );

          const newItem = ul.appendchild( document.createelement( "li" ) );
          const span = newItem.appendchild( document.createelement( "span" ) );
          const input = newItem.appendchild( document.createelement( "input" ) );

          span.classes = "bullet";
          span.innerhtml = "&#9679; &nbsp;&nbsp;";
          span.style = "font-size: 0.8rem;";
          input.type = "text";
          input.classes = "item";

          setListener.item( input );
          setListener.bullet( span );
        }

        await axios.post( "/api/update", {
          updateditem: item.value,
          olditem    : originalItem,
          cardside   : side,
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

        const cards = title.parentNode.parentNode.children;
        /*
         *<div.inner.front
         *<div.inner.back
         *  (p.future)
         *> input.title
         */
        const side = title.parentNode.className.match( /back/ ) ? "back" : "front";
        if ( side === "front" ) { // Update title on other card side
          cards[1].children[1].value = title.value;
        } else {
          cards[0].children[0].value = title.value;
        }

        await axios.post( "/api/update", { updatedTitle: title.value, title: originalTitle } );

        originalTitle = title.value;
      }
    } );
  },
  bullet( bullet ) {
    async function removeItem() {
      const item = bullet.parentNode.children[1].value;
      /*
       * li
       *> span.bullet
       *< input.item
       */
      const side = bullet.parentNode.parentNode.parentNode.className.match( /back/ ) ? "back" : "front";
      /*
       *<div.inner(.front/.back)
       *  ul
       *    li
       *>     span.bullet
       */
      const title = side === "back" ?
        bullet.parentNode.parentNode.parentNode.children[1].value :
        bullet.parentNode.parentNode.parentNode.children[0].value;
      /*
       * div.inner
       *  (p.future)
       *< input.title
       *  ul
       *    li
       *>     span.bullet
       */
      bullet.parentNode.remove();

      const response = await axios.post( "/api/remove-item", { title, item, side } );
      checkResponse( response.data, "app", true );
    }

    bullet.addEventListener( "mouseenter", () => {
      bullet.style = "color: #333;";

      bullet.addEventListener( "click", removeItem );
    } );
    bullet.addEventListener( "mouseleave", () => {
      bullet.style = "color: #F5F7FA";

      bullet.removeEventListener( "click", removeItem );
    } );
  },
  itemSwitch( switchEl, toBack = false ) {
    async function switchHandler() {
      // move to back/front
      // update db
    }

    switchEl.addEventListener( "mouseenter", () => {
      switchEl.addEventListener( "click", switchHandler );
    } );
    switchEl.addEventListener( "mouseleave", () => {
      switchEl.removeEventListener( "click", switchHandler );
    } );
  },
};

function setEventListeners() {
  const items = $( ".item" );
  const titles = $( ".title" );
  const bullets = $( ".bullet" );
  const switchElems = $( ".switch" );

  for ( const item of items ) {
	  setListener.item( item );
  }
  for ( const title of titles ) {
	  setListener.title( title );
  }
  for ( const bullet of bullets ) {
    setListener.bullet( bullet );
  }
  for ( const switchEl of switchElems ) {
    setListener.itemSwitch( switchEl );
  }

  const cards = document.getElementsByClassName( "card" );

  // flip cards
  function flipCard( card ) {
    let cardState = "front";

    card.addEventListener( "dblclick", ( event ) => {
      const el = event.target.tagName;
      const permitted = [ "DIV", "P" ];
      if ( ~permitted.indexOf( el ) ) {
        if ( cardState === "front" ) {
          card.style.transform = "rotateY( 180deg )";
          cardState = "back";
        } else {
          card.style.transform = "rotateY( 0deg )";
          cardState = "front";
        }
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
            <span class="bullet">&#9679; &nbsp;&nbsp;</span>
            <input class="item" type="text" placeholder="Add items">
          </li>
        </ul>
      </div>
      <div class="back inner">
        <p class="future">Future</p> 
        <input class="title" type="text" placeholder="Add title">
        <ul>
          <li>
            <span class="bullet">&#9679; &nbsp;&nbsp;</span>
            <input class="item" type="text" placeholder="Add items">
          </li>
        </ul>
      </div>
     `;

    for ( const item of cardToBeSet.children ) {
      const side = item.children.length == 3 ? 2 : 1;
      setListener.item( item.children[side].children[0].children[1] );
      /*
       * item.childen[ side ].childeren[0].children[0]
       *>div.inner(.front/.back)
       *  (p.future)
       *  input.title
       *  ul
       *    li
       *      span.bullet
       *      input.item 
       */
    }
    for ( const title of cardToBeSet.children ) {
      const side = title.children.length == 3 ? 1 : 0;
      setListener.title( title.children[side] );
      /*
       * title.children[ side ]
       *>div.inner(.front/.back)
       *  (p.future)
       *  input.title
       *  ul
       */
    }
    for ( const bullet of cardToBeSet.children ) {
      const side = bullet.children.length == 3 ? 2 : 1;
      setListener.bullet( bullet.children[side].children[0].children[0] );
      /*
       * bullet.children[ side ].children[0].children[0]
       *>dov.inner(.front/.back)
       *  (p.future)
       *    input.title
       *    ul
       *      li
       *        span.bullet
       *        input.item
       */
    }

    flipCard( cardToBeSet );

    const content = document.getElementById( "inner" );
    const newCard = content.appendChild( document.createElement( "span" ) );

    newCard.innerHTML += `<img class="addCard" src="img/add.png">`;
    newCard.className = "card addCardContainer";
    newCard.addEventListener( "dblclick", cardListenerCallback );

    const cardIdRequest = await axios.post( "/api/generate-cardId" );
    const cardId = cardIdRequest.data._id;

    axios.post( "/api/add-new-card", { _id: cardId } );
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

setEventListeners();
