/*
This theme tries to use all 4 sensor nodes for each of the five bands.
*/

function bezier_lines_4() {
    colorMode(RGB, 255);
    rectMode(CORNER);
    strokeWeight(1);

    background(123);

    colorMode(HSB, 360);

    var bands = ["delta", "theta", "alpha", "beta", "gamma"];

    stroke(255, 0, 0, 123);
    fill(255, 0, 0, 123);

    for (var i = 0; i < bands.length; i++) {
        var thisBand, nextBand;
        thisBand = muse[bands[i]];
        nextBand = muse[bands[(i + 1) % bands.length]];


        bezier(
            thisBand[0] * width,
            nextBand[0] * height,
            thisBand[1] * width,
            nextBand[1] * height,
            thisBand[2] * width,
            nextBand[2] * height,
            thisBand[3] * width,
            nextBand[3] * height
        );

        stroke(137, 255, 0, 123);
        fill(137, 255, 0, 123);

        bezier(
            nextBand[0] * height,
            thisBand[0] * width,
            nextBand[1] * height,
            thisBand[1] * width,
            nextBand[2] * height,
            thisBand[2] * width,
            nextBand[3] * height
            thisBand[3] * width,
        );

    }
}
