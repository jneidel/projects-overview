"use strict";

$("document").ready(function(){
    for (let item = 2; item < 9; item++) {
    let itemContent = $("#Item"  + item).contents().clone();
    let itemContentHidden = $("#ItemHidden"  + item).contents().clone();
    
    drawTo1st(itemContent, false);
    drawTo1st(itemContentHidden, true);
    }

    function drawTo1st(content, isHidden) {
        for (let i in content) {
            if ((i - 1) % 2 == 0) {
                if (isHidden) {
                    $("#ItemHidden1").append(content[i])
                } else {
                    $("#Item1").append(content[i]);
                }
            }
        }
    }
    document.getElementById("Container1").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(1) });
    document.getElementById("Container2").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(2) });
    document.getElementById("Container3").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(3) });
    document.getElementById("Container4").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(4) });
    document.getElementById("Container5").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(5) });
    document.getElementById("Container6").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(6) });
    document.getElementById("Container7").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(7) });
    document.getElementById("Container8").addEventListener("dblclick", function runSwitchToHidden() { switchToHidden.switch(8) });
});

var switchToHidden = { first: false, second: false, third: false, forth: false, fifth: false, sixth: false, seventh: false, eight: false,
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
                break;
            case(8):
                num = "eight";
        }
        if (switchToHidden[num]) {
            $("#ItemHidden" + i).css("display", "none");
            $("#Item" + i).css("display", "block");
            $("#status" + i).html(" [c]");
            switchToHidden[num] = false;
            
        } else {
            $("#ItemHidden" + i).css("display", "block");
            $("#Item" + i).css("display", "none");
            $("#status" + i).html(" [f]");
            switchToHidden[num] = true;
        }
    }
}
