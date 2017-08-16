"use strict";

$("document").ready(function() {
    // Draw values form values.js
    for (let container in values) {
        for (let item in values[container]) {
            let i = values[container][item];
            $("#" + container).append("<li>" + i + "</li>");

            if (container.slice(4, 10) === "Hidden") {
                $("#ItemHidden1").append("<li>" + i + "</li>")
            } else {
                $("#Item1").append("<li>" + i + "</li>");
            }
        }
    }
    document.getElementById("Container1").addEventListener("dblclick", function() { switchToHidden.switch(1) });
    document.getElementById("Container2").addEventListener("dblclick", function() { switchToHidden.switch(2) });
    document.getElementById("Container3").addEventListener("dblclick", function() { switchToHidden.switch(3) });
    document.getElementById("Container4").addEventListener("dblclick", function() { switchToHidden.switch(4) });
    document.getElementById("Container5").addEventListener("dblclick", function() { switchToHidden.switch(5) });
    document.getElementById("Container6").addEventListener("dblclick", function() { switchToHidden.switch(6) });
    document.getElementById("Container7").addEventListener("dblclick", function() { switchToHidden.switch(7) });
    document.getElementById("Container8").addEventListener("dblclick", function() { switchToHidden.switch(8) });
    document.getElementById("Container9").addEventListener("dblclick", function() { switchToHidden.switch(9) });
});

var switchToHidden = { first: false, second: false, third: false, forth: false, fifth: false, sixth: false, seventh: false, eight: false, ninth: false,
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
                break;
            case(9):
                num = "ninth";
        }
        if (switchToHidden[num]) {
            $("#ItemHidden" + i).css("display", "none");
            $("#Item" + i).css("display", "block");
            $("#status" + i).html(" [a]");
            switchToHidden[num] = false;
            
        } else {
            $("#ItemHidden" + i).css("display", "block");
            $("#Item" + i).css("display", "none");
            $("#status" + i).html(" [f]");
            switchToHidden[num] = true;
        }
    }
}