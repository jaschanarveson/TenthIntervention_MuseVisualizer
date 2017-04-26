
/*
        Welcome to appB.js
        ------------------

This script takes filtered Muse OSC data from appA.js and simply passes it on to the p5.js sketch running in the browser.

appA and appB are separate to allow for two machines: one for processing the Muse (CPU instensive) and one for running p5.js (also CPU intensive, potentially).

*/

var osc = require("osc");
var WebSocket = require("ws");
var express = require("express");
var app = express();

// Define the port to run on
app.set("port", 3000);

// Listen for requests
var server = app.listen(app.get("port"), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/p5-visuals', express.static(__dirname + '/p5-visuals'));
app.use('/media', express.static(__dirname + '/media'));

var udp = new osc.UDPPort({
    // local address should be set to actual network address of the computer
    // NOT the usual 127.0.0.1.
    // So: set this according to whatever machine you're running on.
    localAddress: "localhost",
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
