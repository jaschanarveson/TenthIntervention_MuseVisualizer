/*
This theme tries to use all 4 sensor nodes for each of the five bands.
*/

function bezier_lines_2() {
    colorMode(RGB, 255);
    rectMode(CORNER);
    strokeWeight(1);

    background(123);


    stroke(255, 108, 0, 123);
    fill(255, 108, 0, 123);

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

    stroke(137, 255, 0, 123);
    fill(137, 255, 0, 123);

    bezier(
        muse.theta[0] * width,
        muse.gamma[0] * height,
        muse.theta[1] * width,
        muse.gamma[1] * height,
        muse.theta[2] * width,
        muse.gamma[2] * height,
        muse.theta[3] * width,
        muse.gamma[3] * height
    );

}
