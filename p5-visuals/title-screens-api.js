function makeTitlesAPI() {
    var API;
    API = {
        creditInfo: null,
        running: false,
        counter: 0,
        fadeTime: 100,
        countStep: 1,
        fadein: function () {
            if (!API.running && API.creditInfo !== null) {
                console.log("fading in!");
                console.log(API.creditInfo);
                API.running = true;
                API.counter = 1;
                API.countStep = 1;
            }
        },
        fadeout: function () {
            if (API.running) {
                API.countStep = -1;
                API.count = API.fadeTime - 1;
            }
        },
        update: function () {
            if (API.running) {
                if (API.counter === 0) {
                    API.running = false;
                    API.creditInfo = null;
                    console.log("all faded out!");
                }
                if (API.creditInfo !== null) {
                    console.log("updating: " + API.counter);
                    colorMode(RGB, API.fadeTime);
                    rectMode(CORNER);
                    textSize(14);
                    textAlign(CENTER, CENTER);
                    textFont("Ariel")
                    var string = "";
                    for (prop in API.creditInfo) {
                        string += prop + ": " + API.creditInfo[prop] + "\n";
                    }
                    noStroke();
                    fill(0, 0, 0, API.counter);
                    rect(0, 0, width, height);
                    fill(API.fadeTime, API.fadeTime, API.fadeTime, API.counter);
                    text(string, 0, 0, width, height);

                    API.counter += API.countStep;
                    if (API.counter > API.fadeTime) {
                        API.counter = API.fadeTime;
                    }
                } else {
                    console.log("nothing to print!");
                }
            }
        }
    }
    return API;
}
