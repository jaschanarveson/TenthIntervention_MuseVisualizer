/*
        Welcome to appA.js
        ------------------

This script takes OSC from the Muse headband (or recordings thereof), and does the following:

- only passes on desired data (there's A LOT of data coming off the Muse - too much to use)
- takes slow data (10Hz) and interpolates values to get smoother 60Hz output streams

The OSC is forwarded to port 8888, where appB.js is listening and passing it on to p5.js in the browser.
*/

var osc = require("osc");
var forEach = require("for-each");
var timedQueueModule = require("./app-timedQueue.js");
var timeQueue = timedQueueModule();

var udp = new osc.UDPPort({
    localAddress: "127.0.0.1", // receive locally from muse.io
    localPort: 5000, // on port 5000, by default 
    remoteAddress: "127.0.0.1", // send remotely to the p5 computer (insert appropriate address here)
    remotePort: 8888 // on port 8888
});


var incomingValues = {};
var snapshot = {};
var lastSnapshot = {};
var deltas = {};

var oscPaths = [
    "/muse/elements/delta_session_score",
    "/muse/elements/theta_session_score",
    "/muse/elements/alpha_session_score",
    "/muse/elements/beta_session_score",
    "/muse/elements/gamma_session_score",
    "/muse/elements/experimental/concentration",
    "/muse/elements/experimental/mellow"
];



/*
incoming osc data:

fff (-2000 to 1996) 50Hz
'/muse/acc'

f (0 to 1) 10Hz
'/muse/elements/experimental/concentration'
'/muse/elements/experimental/mellow'

ffff (0 to 1) 10Hz 
'/muse/elements/delta_session_score'
'/muse/elements/theta_session_score'
'/muse/elements/alpha_session_score'
'/muse/elements/beta_session_score'
'/muse/elements/gamma_session_score'

f (boolean: 0 or 1) 10Hz
'/muse/elements/jaw_clench'
'/muse/elements/blink'
*/


udp.on("message", function (message, timeTag, info) {

    // certain functions are logged (see log_message() below) to
    // keep track of arrival times, to allow for interpolation
    // from slow 10Hz receipt time to a smoother 60Hz send-time.



    // accelerometer data is recieved at 50Hz, so no need to convert to 60Hz
    if (message.address === "/muse/acc") {
        // convert accelerometer ranges from [-2000, 1996] to [0, 1]
        message.args = message.args.map(function (num) {
            return (num + 2000) / 4000;
        });
        simple_forwarding(message);


        // jaw and blink can just pass through at 10Hz, since they're simple binary states
    } else if (
        message.address === "/muse/elements/jaw_clench" ||
        message.address === "/muse/elements/blink"
    ) {
        simple_forwarding(message);


        // band session scores arrive as array of 4 values at 10Hz, so
        // they get interpolated up to 60Hz
    } else if (
        message.address === "/muse/elements/delta_session_score" ||
        message.address === "/muse/elements/theta_session_score" ||
        message.address === "/muse/elements/alpha_session_score" ||
        message.address === "/muse/elements/beta_session_score" ||
        message.address === "/muse/elements/gamma_session_score"
    ) {
        // add the avg to the end of the band's args array (for fun)
        // for other tweaks to the array, modify the process_band_args() function below

        process_band_args(message);
        log_message(message);


        // concentration and mellow get interpolated from 10Hz to 60Hz
    } else if (
        message.address === "/muse/elements/experimental/concentration" ||
        message.address === "/muse/elements/experimental/mellow"
    ) {
        log_message(message);
    }

});

// Open the socket. 
udp.open();

udp.on("ready", function () {
    console.log("----------------------------------------");
    console.log("receiving Muse OSC on:");
    console.log("    Host: " + udp.options.localAddress);
    console.log("    Port: " + udp.options.localPort);
    console.log("----------------------------------------");
    console.log("forwarding to:");
    console.log("    Host: " + udp.options.remoteAddress);
    console.log("    Port: " + udp.options.remotePort);
    console.log("----------------------------------------");
});

// - - - - - functions - - - - - - 


function simple_forwarding(msg) {
    udp.send({
        address: msg.address,
        args: msg.args
    });
}

function log_message(msg) {
    incomingValues[msg.address] = msg.args;
}

function move_snapshot_to_lastSnapshot() {
    for (var i = 0; i < oscPaths.length; i++) {
        lastSnapshot[oscPaths[i]] = snapshot[oscPaths[i]];
    };
}

function take_snapshot() {
    for (var i = 0; i < oscPaths.length; i++) {
        snapshot[oscPaths[i]] = incomingValues[oscPaths[i]];
    };
}

function create_deltas() {
    for (var i = 0; i < oscPaths.length; i++) {
        var prop = oscPaths[i];
        deltas[prop] = snapshot[prop].map(function (currentVal, i) {
            return lastSnapshot[prop][i] - currentVal
        });
    }
}

function send_out_interpolated_values(totalTime, intervals) {
    totalTime = totalTime || 100; // set default of 100ms
    intervals = intervals || 6; // set default of 6 repeats
    var waitTime = totalTime / intervals;
    create_deltas();
    for (var stepNum = 0; stepNum < intervals; stepNum++) {  // for each interpoloated step...
        var packets = [];                                    // gather up all the packets in a bundle
        for (var j = 0; j < oscPaths.length; j++) {          // path by path
            var oscAddr = oscPaths[j];
            var singlePacket = {};
            var oscArgs = lastSnapshot[oscAddr].map(
                function (val, indx) {
                    return val + (deltas[oscAddr] * stepNum)
                }
            );
            singlePacket.address = oscAddr;
            singlePacket.args = oscArgs;
            packets.push(singlePacket);   // add the packet to the bundle
        }
    };

}

// this function adds the average to the end of the 4-value band_session_score arg array
function process_band_args(msg) {
    var sum = msg.args.reduce(function (acc, val) {
        return acc + val
    }, 0);
    var avg = sum / 4;
    msg.args.push(avg);
}

function average_band_vals(msg) {
    var ray = msg.args.map(function (num) {
        return num * 1
    });
    var avg = (ray[0] + ray[1] + ray[2] + ray[3]) / 4;
    msg.args = [avg];
}

function prec(num) {
    var st = "" + Math.floor(num * 1000) / 1000;
    if (st.length < 5) {
        st += "     ";
    }
    st = st.slice(0, 5);
    return st;
}
