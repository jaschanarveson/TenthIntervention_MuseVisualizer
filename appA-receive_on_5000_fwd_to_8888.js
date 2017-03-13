/*
        Welcome to appA.js
        ------------------

This script takes OSC from the Muse headband (or recordings thereof), and does the following:

- only passes on desired data (there's A LOT of data coming off the Muse - too much to use)
- takes slow data (10Hz) and interpolates values to get smoother 60Hz output streams

The OSC is forwarded to port 8888, where appB.js is listening and passing it on to p5.js in the browser.
*/

var osc = require("osc");

var udp = new osc.UDPPort({
    localAddress: "127.0.0.1", // receive locally from muse.io
    localPort: 5000, // on port 5000, by default 
    remoteAddress: "127.0.0.1", // send remotely to the p5 computer (insert appropriate address here)
    remotePort: 8888 // on port 8888
});

var lastTimes = {};
var timeDifferences = {};
var lastVals = {};

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
        simple_forwarding(message);  // no interpolation for now

        // concentration and mellow get interpolated from 10Hz to 60Hz
    } else if (
        message.address === "/muse/elements/experimental/concentration" ||
        message.address === "/muse/elements/experimental/mellow"
    ) {
        process_band_args(message);  // no interpolation for now
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
    // get the time of msg arrival and log the delta in 'timeDifferences'
    // (unless this is the very first message we're getting, in which case just
    // put log the arrival time and wait for #2 onward)
    if (lastTimes[msg.address] !== undefined) {
        // get the delta in high-resolution time (nanoseconds)
        var diff = process.hrtime(lastTimes[msg.address]);

        // convert from nanoseconds to regular millliseconds
        timeDifferences[msg.address] = (diff[0] * 1000) + (diff[1] / 1000000);
    }
    // update the lastTime in high-res format for the next delta calculation...
    lastTimes[msg.address] = process.hrtime();
}

function store_current_args_as_previous_args(msg) {
    lastVals[msg.address] = msg.args; // store the args array for reference
}


// this function adds the average to the end of the 4-value band_session_score arg array
function process_band_args(msg) {
    var sum = msg.args.reduce(function (acc, val) {
        return acc + val
    }, 0);
    var avg = sum / 4;
    msg.args.push(avg);
}

function interpolate_args_newVersion(msg) {
    var repeats = 6; // ie: send 6 messages for every one we get at 10Hz
    var waitTime = timeDifferences[msg.address];

    // if prevValues is undefined (ie: this is the first message), just the the current args
    var prevValues = lastVals[msg.address] || msg.args;
    var targetValues = msg.args;

    //    console.log("\n\n\n\n");
    //    console.log("1.    current: " + targetValues);
    //    console.log("2.   previous: " + prevValues);
    //    console.log("3. wait times: " + waitTime);

    // determine how much each value in the args array needs to travel in the interpolation
    var deltas = targetValues.map(function (val, i) {
        return val - prevValues[i]
    });

    // and what the step-size should be...
    var steps = deltas.map(function (d) {
        return d / repeats
    });

    // console.log("- - - - - interpolated:");

    // then send 6 (or 'repeats' number) of messages with the incremental changes
    for (var rep = 0; rep < repeats; rep++) {

        // figure out intermediate values for each tick of the clock
        var interpolatedValues = prevValues.map(function (prev, i) {
            return prev + (steps[i] * (rep + 1));
        });

        // send out the interpolated osc messages at the appropriate time delays

        send_osc_at_time_delay(msg.address, interpolatedValues, waitTime * rep);
    }
}

function send_osc_at_time_delay(oscAddress, oscArgs, tDelay) {
    setTimeout(function () {
        //        console.log(oscArgs);
        udp.send({
            address: oscAddress,
            args: oscArgs
        });
    }, tDelay);
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
