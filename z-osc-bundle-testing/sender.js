var osc = require("osc");
var forEach = require("for-each");
var timedOscBundleQueue = bundleQueue();

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
            console.log("sending a burst of bundles");
            fireTheQueue();
        },
        3000
    );
}

function fireTheQueue() {
    console.log("here comes a burst of six");
    for (var i = 0; i < 6; i++) {
        var packets = [];
        forEach(oscdata, function (value, key, object) {
            var packet = {
                address: key,
                args: value
            };
            packets.push(packet);
        });
        timedOscBundleQueue.add(udp, packets, 200);
    }
    timedOscBundleQueue.start();
}

function bundleQueue() {
    var API; // internal referance to interface
    const queue = []; // array to hold functions
    var task = null; // the next task to run
    var tHandle; // To stop pending timeout
    function next() { // runs current scheduled task and  creates timeout to schedule next
        if (task !== null) { // is task scheduled??
            task.udpPort.send({
                timeTag: osc.timeTag(),
                packets: task.packets
            });
            task = null; // clear task
        }
        if (queue.length > 0) { // are there any remain tasks??
            task = queue.shift(); // yes set as next task
            tHandle = setTimeout(next, task.time) // schedual when
        } else {
            API.done = true;
        }
    }
    return API = {
        add: function (udpPort, packets, time) {
            queue.push({
                udpPort: udpPort,
                packets: packets,
                time: time
            });
        },
        start: function () {
            if (queue.length > 0 && API.done) {
                API.done = false; // set state flag
                tHandle = setTimeout(next, 0);
            }
        },
        clear: function () {
            task = null; // remove pending task
            queue.length = 0; // empty queue
            clearTimeout(tHandle); // clear timeout
            API.done = true; // set state flag
        },
        done: true,
    }
};


//
//function sendSingleBundle() {
//    var packets = [];
//    forEach(oscdata, function (value, key, object) {
//        var packet = {
//            address: key,
//            args: value
//        };
//        packets.push(packet);
//    });
//    //    for (var i = 0; i < oscPaths.length; i++) {
//    //        var path = oscPaths[i];
//    //        var pack = {};
//    //        pack.address = path;
//    //        pack.args = Math.random();
//    //        packets.push(pack);
//    //    };
//    udp.send({
//        timeTag: osc.timeTag(),
//        packets: packets
//    });
//}
