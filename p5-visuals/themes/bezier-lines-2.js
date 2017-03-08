/*
This theme tries to use all 4 sensor nodes for each of the five bands.
*/

function bezier_lines_2 () {
    colorMode(HSB, 255);
    rectMode(CORNER);
    strokeWeight(1);

    background(123);


    stroke(255);
    fill(0);

    bezier(
        muse.alpha[0] * width,
        muse.beta[0] * height,
        muse.alpha[1] * width,
        muse.beta[1] * height,
        muse.alpha[2] * width,
        muse.beta[2] * height,
        muse.alpha[3] * width,
        muse.beta[3] * height
    );
}
