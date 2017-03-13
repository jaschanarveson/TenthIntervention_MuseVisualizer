var osc = require("osc");
var forEach = require("for-each");

var udp = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 9999
});

udp.open();

udp.on("ready", function () {
    console.log("receiver is ready");
});

udp.on("bundle", function (oscBundle) {
    console.log("- - - - - - - - - ");
    console.log(oscBundle.timeTag);
//    forEach(oscBundle.packets, function(value, index, array) {
//        console.log(value.address + ' ' + value.args );
//    });
});



