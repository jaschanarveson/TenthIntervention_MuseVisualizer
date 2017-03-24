/*
        Welcome to the main p5 sketch.js file
        -------------------------------------

The idea is that this sketch acts as a container for many separate THEME sketches, which, in turn, each act as separate functions to be run in the draw() loop.

The THEMES all share global variables stored in the 'muse' object, which are updated via OSC received from appB.js.

This sketch also sets up some KEYBOARD SHORTCUTS to allow for flipping between THEMES quickly, as well as overlaying the 'muse' data on the screen if desired.

*/



// first: set up the web socket to get OSC from Node

// the OSC listening port of 8888 is defined in the
// appB-receive8888_fwd_to_p5.js file

var port = new osc.WebSocketPort({
    url: "ws://localhost:8081"
});

var lastTime = 0;

port.open();

port.on("message", function (message) {
    // osc messages are handled by the
    // receiveOsc function defined at the bottom...
    receiveOsc(message.address, message.args);
});

// - - actual p5.js sketch code - - 

// hold all the muse data in one place...
var muse = {
    x: 0,
    y: 0,
    z: 0,
    concentration: 0,
    mellow: 0,
    delta: [0, 0, 0, 0],
    theta: [0, 0, 0, 0],
    alpha: [0, 0, 0, 0],
    beta: [0, 0, 0, 0],
    gamma: [0, 0, 0, 0],
    bandAverages: {
        delta: 0,
        theta: 0,
        alpha: 0,
        beta: 0,
        gamma: 0
    },
    jaw: 0,
    blink: 0
};
var museProps = Object.keys(muse);


// hold the different visualizer functions defined in the 'themes' folder
var funcs = {};
var activeFunc = '1'; // this is the selector for which function to use in the draw() loop

var textOverlay; // boolean indicating the presence or absence of text overlay for the muse data

// for fading-in and fading-out info on title screens
var titlescreen;

var credit_hotkeys = {
    z: {
        composer: "Tanya Ko",
        title: "(sounds like ecstasy)",
        visuals: "whoever did the visuals"
    },
    x: {
        composer: "Kate Soper",
        title: "(sounds like anxiety)",
        visuals: "whoever did the visuals"
    },
    c: {
        composer: "Dorian Wallace",
        title: "(sounds like fear)",
        visuals: "whoever did the visuals"
    },
    v: {
        composer: "Daniel Felsenfeld",
        title: "(sounds like sensuality)",
        visuals: "whoever did the visuals"
    }
};

function setup() {
    createCanvas(windowWidth, windowHeight); // resizeable canvas (see windowResized() func at bottom)

    frameRate(30);

    textOverlay = true; // start with text overlay, just for reassurance that everything's working
    titlescreen = makeTitlesAPI();

    /*    
    One way to write a theme is as a constructor function that returns an object with a draw() function, enabling that theme to have its own variables that persist across each iteration of the draw() loop.
    
    
    the ikeda_lines demo is one such:
    */

    var ikeda_lines;
    ikeda_lines = new Ikeda_lines(20); // in this case, 20 divisions in the stripes


    /*
    KEYBOARD COMMANDS:
    
    Store the different 'themes' functions in the funcs object using keyboard characters as property names, to allow for keyboard shortcuts.
    
    Existing commands (see keyTyped() function at end):
    
    't' = toggle for text-overlay
    'f' = full-screen mode
    
    */

    funcs['1'] = test_circles;

    // this one was made by a constructor, so we refer to its .draw function
    funcs['2'] = ikeda_lines.draw;

    funcs['3'] = bezier_lines_3;
    funcs['4'] = color_grid_plus_bezier_lines;
    funcs['5'] = graph_lines;
    funcs['6'] = bezier_lines_2;
    funcs['7'] = grid_plus_bezier_lines;
    funcs['8'] = bezier_lines_4;

}

function draw() {

    funcs[activeFunc]();


    if (textOverlay) {
        overlayDataOnScreen();
    }
    titlescreen.update();
}

function overlayDataOnScreen() {
    // Drawing functions should take nothing for granted!
    // --> always set colorMode, rectMode, strokeWeight, ellipseMode, etc etc
    colorMode(RGB, 255);
    strokeWeight(0);
    rectMode(CORNER);
    textAlign(LEFT);
    textFont("Monaco");
    textSize(12);
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
    fill(255, 255, 255, 220);

    for (var i = 0; i < museProps.length; i++) {
        var propName = museProps[i];
        text(propName + ':  ' + muse[propName], 20, 40 + (i * 20));
    };
}

function receiveOsc(address, args) {
    switch (address) {
        case '/muse/acc':
            muse.x = args[0];
            muse.y = args[1];
            muse.z = args[2];
            break;
        case '/muse/elements/jaw_clench':
            muse.jaw = args[0];
            break;
        case '/muse/elements/blink':
            muse.blink = args[0];
            break;
        case '/muse/elements/experimental/concentration':
            muse.concentration = args[0];
            break;
        case '/muse/elements/experimental/mellow':
            muse.mellow = args[0];
            break;


            /*
For the band arrays, appA.js is adding the average of the 4-element array to the end before sending, so these cases just .pop() it off and put it in the appropriate spot, leaving the original 4-value args[] array 
         */

        case '/muse/elements/delta_session_score':
            muse.bandAverages.delta = args.pop(); // peel off the average
            muse.delta = args; // this is the original 4-value array now
            break;
        case '/muse/elements/theta_session_score':
            muse.bandAverages.theta = args.pop();
            muse.theta = args;
            break;
        case '/muse/elements/alpha_session_score':
            muse.bandAverages.alpha = args.pop();
            muse.alpha = args;
            break;
        case '/muse/elements/beta_session_score':
            muse.bandAverages.beta = args.pop();
            muse.beta = args;
            break;
        case '/muse/elements/gamma_session_score':
            muse.bandAverages.gamma = args.pop();
            muse.gamma = args;
            break;

        default:
            break;
    }
}

function keyTyped() {
    if (key === 't') {
        textOverlay = !textOverlay;
    } else if (key === 'f') {
        var fs = fullscreen();
        fullscreen(!fs);
    } else if (credit_hotkeys[key] !== undefined) {
        handle_titles(key);
    } else if (funcs[key] !== undefined) {
        console.log('key for active func pressed: ' + key);
        activeFunc = key;
    }
}

function handle_titles(thekey) {
    console.log("i am handling the title");
    if (titlescreen.creditInfo === null) {
        titlescreen.creditInfo = credit_hotkeys[thekey];
        titlescreen.fadein();
    } else {
        titlescreen.fadeout();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
