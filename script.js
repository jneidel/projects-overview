"use strict";

$("document").ready(function(){
    for (let item = 2; item < 8; item++) {
    let itemContent = $("#" + item + "Item").contents().clone();
    let itemContentHidden = $("#" + item + "ItemHidden").contents().clone();
    
    drawTo1st(itemContent, false);
    drawTo1st(itemContentHidden, true);
    }

    function drawTo1st(content, isHidden) {
        for (let i in content) {
            if ((i - 1) % 2 == 0) {
                if (isHidden) {
                    $("#1ItemHidden").append(content[i])
                } else {
                    $("#1Item").append(content[i]);
                }
            }
        }
    }
    document.getElementById("1Container").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(1) });
    document.getElementById("2Container").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(2) });
    document.getElementById("3Container").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(3) });
    document.getElementById("4Container").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(4) });
    document.getElementById("5Container").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(5) });
    document.getElementById("6Container").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(6) });
    document.getElementById("7Container").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(7) });
});

var switchToHidden = { first: false, second: false, third: false, forth: false, fifth: false, sixth: false, seventh: false,
    switch: function(i) {
        let num;
        switch(i) {
            case(1):
                num = "first";
                break;
            case(2):
                num = "second";
                break;
            case(3):
                num = "third";
                break;
            case(4):
                num = "forth";
                break;
            case(5):
                num = "fifth";
                break;
            case(6):
                num = "sixth";
                break;
            case(7):
                num = "seventh";
        }
        if (switchToHidden[num]) {
            $("#" + i + "ItemHidden").css("display", "none");
            $("#" + i + "Item").css("display", "block");
            $("#" + i + "status").html(" [c]");
            switchToHidden[num] = false;
            
        } else {
            $("#" + i + "ItemHidden").css("display", "block");
            $("#" + i + "Item").css("display", "none");
            $("#" + i + "status").html(" [f]");
            switchToHidden[num] = true;
        }
    }
}
