import request from "then-request";
import jwt from "jsonwebtoken";

/* globals Vue */
/* eslint-disable no-alert */

function parseJwt( token ) {
    const base64Url = token.split( "." )[1];
    const base64 = base64Url.replace( "-", "+" ).replace( "_", "/" );
    return JSON.parse( window.atob( base64 ) );
}

const token = localStorage.getItem( "token" );
if ( !token ) {
	window.location.replace( `${url}/login` );
}

const url = "http://localhost:8080";
const username = parseJwt( token ).username;

// Render cards from database
async function setItems() {
	const data = await request( "POST", `${url}/api/getitems?token=${token}` );
	const cards = JSON.parse( data.body );

	if ( cards.error ) {
		window.location.replace( `${url}/logout?unverified=true` );
	}

	var vue = new Vue( {
		el  : "#cards",
		data: {
			cards,
		},
	} );
}

// Listening for item/title changes
function setEventListeners() {
	function itemListener( item ) {
		let originalItem = item.value;

		item.addEventListener( "keydown", () => {
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
				} else {
					var title = titleNode[0].value;
				}

				request( "POST", `${url}/api/update?userid=${username}&updatedItem=${item.value}&oldItem=${originalItem}&cardSide=${cardSide}&title=${title}` );
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

				request( "POST", `${url}/api/update?userid=${username}&updatedTitle=${title.value}&title=${originalTitle}` );
				originalTitle = title.value;
			}
		} );
	}

	const items = document.getElementsByClassName( "item" );
	const titles = document.getElementsByClassName( "title" );

	for ( const item of items ) {
	    itemListener( item );
	}

	for ( const title of titles ) {
	    titleListener( title );
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
				itemListener( item.children[2].children[0].children[0] );
			} else {
				itemListener( item.children[1].children[0].children[0] );
			}
		}

		for ( const title of cardToBeSet.children ) {
			titleListener( title.children[0] );
		}

		flipCard( cardToBeSet );

		const content = document.getElementById( "cards" );
		const newCard = content.appendChild( document.createElement( "span" ) );

		newCard.innerHTML += `<img class="addCard" src="img/add.png">`;
		newCard.className = "card addCardContainer";
		newCard.addEventListener( "dblclick", cardListenerCallback );

		const cardIdRequest = await request( "POST", `${url}/api/generate-cardId` );
		const cardId = JSON.parse( cardIdRequest.body )._id;

		request( "POST", `${url}/api/add-new-card?userid=${username}&_id=${cardId}` );
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
	await setItems();
	setEventListeners();
} )();
