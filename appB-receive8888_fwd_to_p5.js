/*
        Welcome to appB.js
        ------------------

This script takes filtered Muse OSC data from appA.js and simply passes it on to the p5.js sketch running in the browser.

appA and appB are separate to allow for two machines: one for processing the Muse (CPU instensive) and one for running p5.js (also CPU intensive, potentially).

*/

var osc = require("osc");
var WebSocket = require("ws");

var udp = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 8888
});

udp.on("ready", function () {
    console.log("----------------------------------------");
    console.log("receiving OSC on:");
    console.log("    Host: " + udp.options.localAddress);
    console.log("    Port: " + udp.options.localPort);
    console.log("----------------------------------------");
    console.log("forwarding to p5.js.");
    console.log("----------------------------------------");
    
});

udp.open();

var wss = new WebSocket.Server({
    port: 8081
});

wss.on("connection", function (socket) {
    console.log("WebSocket established!");
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

    var relay = new osc.Relay(udp, socketPort, {
        raw: true
    });
});
