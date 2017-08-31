"use strict";

/* globals values */

const switchToHidden = { first  : false,
    second : false,
    third  : false,
    forth  : false,
    fifth  : false,
    sixth  : false,
    seventh: false,
    eight  : false,
    ninth  : false,
    switchHidden( i ) {
        let num;
        switch ( i ) {
            case 1 :
                num = "first";
                break;
            case 2 :
                num = "second";
                break;
            case 3 :
                num = "third";
                break;
            case 4 :
                num = "forth";
                break;
            case 5 :
                num = "fifth";
                break;
            case 6 :
                num = "sixth";
                break;
            case 7 :
                num = "seventh";
                break;
            case 8 :
                num = "eight";
                break;
            case 9 :
                num = "ninth";
        }
        if ( switchToHidden[num] ) {
            $( `#ItemHidden${i}` ).css( "display", "none" );
            $( `#Item${i}` ).css( "display", "block" );
            $( `#status${i}` ).html( " [a]" );
            switchToHidden[num] = false;
        } else {
            $( `#ItemHidden${i}` ).css( "display", "block" );
            $( `#Item${i}` ).css( "display", "none" );
            $( `#status${i}` ).html( " [f]" );
            switchToHidden[num] = true;
        }
    },
};

$( "document" ).ready( () => {
    for ( const container in values ) { // Get values form values.js
        for ( const item in values[container] ) {
            const i = values[container][item];
            $( `#${container}` ).append( `<li>${i}</li>` );

            if ( container.slice( 4, 10 ) === "Hidden" ) {
                $( "#ItemHidden1" ).append( `<li>${i}</li>` );
            } else {
                $( "#Item1" ).append( `<li>${i}</li>` );
            }
        }
    }
    ( function setEventListeners( range ) {
        for ( const i of range ) {
            document.getElementById( `Container${i}` ).addEventListener( "dblclick", () => { switchToHidden.switchHidden( i ); } );
        }
    } )( range( 1, 9 ) );

    function range( minNum, maxNum ) {
        minNum -= 2;
        return Array.from( new Array( maxNum - minNum - 1 ), ( x, i ) => i - minNum );
    }
} );
