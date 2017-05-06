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
                    fill(0, 0, 0, API.counter);
                    rect(0, 0, width, height);
                    fill(API.fadeTime, API.fadeTime, API.fadeTime, API.counter);

                    textSize(24);
                    textAlign(CENTER);
                    textFont("Ariel");
                    textStyle(NORMAL);
                    noStroke();
                    text(API.creditInfo["composer"], 0, height/2 - 40, width, 40);
                    textStyle(ITALIC);
                    text(API.creditInfo["title"], 0, height/2, width, 40);
                    textStyle(NORMAL);
                    textSize(20);
                    text("visuals: " + API.creditInfo["visuals"], 0, height/2 + 40, width, 40);

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
