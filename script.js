"use strict";

/* globals values names order */

const hidden = [ null ];
let globalCounter = 0;
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
                // When empty global flex will have whitespace in it
                $( "#Item1" ).css( "display", "flex" );
                $( "#ItemHidden1" ).css( "display", "flex" );

                const item = values[container][i];
                $( `#Item${container}` ).append( `<li>${item}</li>` );
                $( "#Item1" ).append( `
                    <li style="order: ${order.indexOf( names[container] )};">${item}</li>`
                );
                globalCounter++;
            }
            for ( const i in values[`hidden${container}`] ) {
                const item = values[`hidden${container}`][i];
                $( `#ItemHidden${container}` ).append( `<li>${item}</li>` );
                $( "#ItemHidden1" ).append( `
                    <li style="order: ${order.indexOf( names[container] )};">${item}</li>`
                );
            }
            hidden.push( false );
            document.getElementById( `Container${container}` ).addEventListener( "dblclick", () => { switchToHidden( container ); } );
        }
    }
    document.getElementById( `Container1` ).addEventListener( "dblclick", () => { switchToHidden( "1" ); } );

    if ( globalCounter >= 10 ) {
        $( "#globalWarning" ).html( `You got ${globalCounter} projects running,<br>please refrain from starting any new projects.` );
        $( "#globalWarning" ).css( "margin-bottom", "-3px" );
    }
} );
