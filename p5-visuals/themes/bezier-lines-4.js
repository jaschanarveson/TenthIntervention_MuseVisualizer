/*
This theme tries to use all 4 sensor nodes for each of the five bands.
*/

function bezier_lines_4() {
    colorMode(RGB, 255);
    rectMode(CORNER);
    strokeWeight(1);

    background(33);


    var bands = ["delta", "theta", "alpha", "beta", "gamma"];

    stroke(255, 0, 0, 123);
    fill(255, 0, 0, 123);

    push();
    translate(width / 2, 0);
    rotate(radians(45));

    for (var i = 0; i < bands.length; i++) {
        var thisBand, nextBand;
        thisBand = muse[bands[i]];
        nextBand = muse[bands[(i + 1) % bands.length]];

        scale(map(muse.concentration, 0, 1, 0.9, 1.5), map(muse.mellow, 0, 1, 0.8, 1));

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


        bezier(
            nextBand[0] * width,
            thisBand[0] * height,
            nextBand[1] * width,
            thisBand[1] * height,
            nextBand[2] * width,
            thisBand[2] * height,
            nextBand[3] * width,
            thisBand[3] * height
        );

    }

    pop();
}
