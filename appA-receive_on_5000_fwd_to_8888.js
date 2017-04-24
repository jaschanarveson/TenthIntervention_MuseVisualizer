
/*
        Welcome to appA.js
        ------------------

This script takes OSC from the Muse headband (or recordings thereof), and does the following:

- only passes on desired data (there's A LOT of data coming off the Muse - too much to use)
- takes slow data (10Hz) and interpolates values to get smoother 60Hz output streams

Interpolation is done by in the start_interpolation_loop() function.

- taking a snapshot of the values every 200ms
- determining the deltas from the last snapshot to the current one
- interpolate from previous to current values in 12 equally timed steps (ie: at 60Hz)

The OSC is forwarded to port 8888, where appB.js is listening and passing it on to p5.js in the browser.

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

var osc = require("osc");
var forEach = require("for-each");
var timedOscBundleQueue = bundleQueue();

var udp = new osc.UDPPort({
    // local address should be set to actual network address of the computer
    // NOT the usual 127.0.0.1.
    // So: set this according to whatever machine you're running on.
    localAddress: "oldwhoohoo.local", // receive locally from muse.io
    localPort: 5000, // on port 5000, by default
    remoteAddress: "jascha.local", // send remotely to the p5 computer (insert appropriate address here)
    remotePort: 8888 // on port 8888
});


var incomingValues = {};
var snapshot = {};
var lastSnapshot = {};
var deltas = {};

var oscMessagesHaveArrived = false;

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
        oscMessagesHaveArrived = true;
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

    wait_for_first_message();
});

function wait_for_first_message() {
    console.log("waiting for first messages to arrive...");
    if (oscMessagesHaveArrived) {
        console.log("Taking initial snapshot...");
        take_snapshot();
//        console.log(snapshot);
        console.log("Here are the incoming values that were snapshotted:");
//        console.log(incomingValues);
        start_interpolation_loop();
    } else {
        setTimeout(function () {
            wait_for_first_message();
        }, 500);
    }
}

// - - - - - functions - - - - - - 

function start_interpolation_loop() {
    console.log("Starting to send interpolated OSC data...");
    setInterval(function () {
        move_snapshot_to_lastSnapshot();
        take_snapshot();
        create_deltas(); // determine the diffs between current and previous snapshot
        send_out_a_round_of_interpolated_values(200, 12); // send out 6 OSC bundles of interpolated data in 100ms
    }, 200);

}

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
    forEach(snapshot, function (value, key, obj) {
        lastSnapshot[key] = snapshot[key];
    })
}

function take_snapshot() {
    forEach(incomingValues, function (value, key, obj) {
        snapshot[key] = value;
    });
}

function create_deltas() {
    forEach(snapshot, function (value, key, obj) {
        deltas[key] = snapshot[key].map(function (currentVal, i) {
            return currentVal - lastSnapshot[key][i];
        });
    });
}

function send_out_a_round_of_interpolated_values(totalTime, intervals) {
    totalTime = totalTime || 100; // set default of 100ms
    intervals = intervals || 6; // set default of 6 repeats
    var waitTime = totalTime / intervals;
    for (var stepNum = 0; stepNum < intervals; stepNum++) { // for each interpoloated step...
        var packets = []; // gather up all the packets in a bundle
        forEach(lastSnapshot, function (value, key, obj) {
            var singlePacket = {};
            var oscArgs = lastSnapshot[key].map(
                function (val, indx) {
                    return val + ((deltas[key][indx] / intervals) * stepNum);
                }
            );
            singlePacket.address = key;
            singlePacket.args = oscArgs;
            packets.push(singlePacket);
        });
        timedOscBundleQueue.add(udp, packets, waitTime);
    };
    timedOscBundleQueue.start();
}

// this function adds the average to the end of the 4-value band_session_score arg array
function process_band_args(msg) {
    var sum = msg.args.reduce(function (accum, val) {
        return accum + val
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
