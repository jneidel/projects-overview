"use strict";

/* globals values names */

const hidden = [ null ];
function switchToHidden( i ) {
    if ( hidden[i] ) {
        $( `#ItemHidden${i}` ).css( "display", "none" );
        $( `#Item${i}` ).css( "display", "block" );
        $( `#status${i}` ).html( " [a]" );
        hidden[i] = false;
    } else {
        $( `#ItemHidden${i}` ).css( "display", "block" );
        $( `#Item${i}` ).css( "display", "none" );
        $( `#status${i}` ).html( " [f]" );
        hidden[i] = true;
    }
}

$( "document" ).ready( () => {
    for ( const container in values ) { // Get values form values.js
        if ( container.slice( 0, 6 ) !== "hidden" ) {
            $( "#container" ).append( `
            <div id="Container${container}" class="item">
                <h2>${names[container]}</h2><span id="status${container}" class="status"></span>
                <p>
                    <ul>
                        <span id="Item${container}"></span>
                        <span id="ItemHidden${container}" class="hidden"></span>
                    </ul>
                </p>
            </div>` );
            for ( const i in values[container] ) {
                const item = values[container][i];
                $( `#Item${container}` ).append( `<li>${item}</li>` );
                $( "#Item1" ).append( `<li>${item}</li>` );
            }
            for ( const i in values[`hidden${container}`] ) {
                const item = values[`hidden${container}`][i];
                $( `#ItemHidden${container}` ).append( `<li>${item}</li>` );
                $( "#ItemHidden1" ).append( `<li>${item}</li>` );
            }
            hidden.push( false );
            document.getElementById( `Container${container}` ).addEventListener( "dblclick", () => { switchToHidden( container ); } );
        }
    }
    document.getElementById( `Container1` ).addEventListener( "dblclick", () => { switchToHidden( "1" ); } );
} );
