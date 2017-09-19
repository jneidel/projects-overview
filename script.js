"use strict";

/* globals values names order */

const hidden = [ null ];
let globalCounter = 0;
function switchToHidden( i ) {
    if ( hidden[i] ) {
        updateDisplay(
            "none",
            "block",
            " [a]"
        );
    } else {
        updateDisplay(
            "block",
            "none",
            " [f]"
        );
    }
    function updateDisplay( itemHidden, item, status ) {
        document.getElementById( `ItemHidden${i}` ).style.display = itemHidden;
        document.getElementById( `Item${i}` ).style.display = item;
        document.getElementById( `status${i}` ).innerHTML = status;
        hidden[i] = item === "none";
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
                // $( "#ItemHidden1" ).css( "display", "flex" ); messes with display: hidden

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
        const globalWarning = document.getElementById( "globalWarning" );
        globalWarning.innerHTML = `You got ${globalCounter} projects running,<br>please refrain from starting any new projects.`;
        globalWarning.style.marginBottom = "-3px";
    }
} );
