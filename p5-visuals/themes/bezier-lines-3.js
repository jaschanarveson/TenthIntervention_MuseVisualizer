/*
This theme tries to use bezier lines to visualize incoming band data.

THIS one streatches them all across the canvas, using the four sensor points for each band as the (x,y,x,y) points for the two control points for the bezier curves.  It also just lays them all on top of eachother, which I think looks more interesting than putting them in separate parts of the screen.
*/

function bezier_lines_3() {
    colorMode(HSB, 360);
    rectMode(CORNER);
    strokeWeight(1);
    background(123);

    var bands = ["delta", "theta", "alpha", "beta", "gamma"];

    var vDivHeight = height / bands.length;
    var vOffset = vDivHeight / 2;

    for (var i = 0; i < bands.length; i++) {
        var bandname = bands[i];

        fill(360 * (i / bands.length), 360, 360, 60);
        stroke(360 * (i / bands.length), 360, 360, 60);

        bezier(
            // anchor 1
            0,
            height / 2,
            // control point 1
            muse[bandname][0] * width,
            map(muse[bandname][1], 0, 1, height, 0),
            // control point 2
            muse[bandname][2] * width,
            map(muse[bandname][3], 0, 1, height, 0),
            // anchor 2
            width,
            height / 2
        );
    };

}
