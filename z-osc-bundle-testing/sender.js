var osc = require("osc");
var forEach = require("for-each");

var udp = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 8888,
    remoteAddress: "127.0.0.1",
    remotePort: 9999
});

var oscdata = {

    "/muse/elements/delta_session_score": [0, 1, 2, 3],
    "/muse/elements/theta_session_score": [4, 5, 6, 7],
    "/muse/elements/alpha_session_score": [8, 9, 10, 11],
    "/muse/elements/beta_session_score": [12, 13, 14, 15],
    "/muse/elements/gamma_session_score": [16, 17, 18, 19],
    "/muse/elements/experimental/concentration": [20, 21, 23, 24],
    "/muse/elements/experimental/mellow": [25, 26, 27, 28]
};


udp.open();

udp.on("ready", function () {
    console.log("sender is ready");
    startSendinBundles();
});

function startSendinBundles() {
    setInterval(
        function () {
            console.log("sent a bundle");
            sendSingleBundle();
        },
        160
    );
}

function sendSingleBundle() {
    var packets = [];
    forEach(oscdata, function(value, key, object) {
        var packet = {
            address: key,
            args: value
        };
        packets.push(packet);
    });
    //    for (var i = 0; i < oscPaths.length; i++) {
    //        var path = oscPaths[i];
    //        var pack = {};
    //        pack.address = path;
    //        pack.args = Math.random();
    //        packets.push(pack);
    //    };
    udp.send({
        timeTag: osc.timeTag(),
        packets: packets
    });
}
