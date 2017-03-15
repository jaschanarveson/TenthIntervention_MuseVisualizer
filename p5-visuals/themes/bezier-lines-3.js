/*
This theme tries to use bezier lines to visualize incoming band data...
*/

function bezier_lines_3() {
    colorMode(HSB, 255);
    rectMode(CORNER);
    noStroke();
    background(123);

    var bands = ["delta", "theta", "alpha", "beta", "gamma"];

    var vDivHeight = height / bands.length;
    var vOffset = vDivHeight / 2;

    for (var i = 0; i < bands.length; i++) {
        var vMin = vDivHeight * i;
        var vMax = vMin + vDivHeight;
        var bandname = bands[i];

        fill(360 * (i/bands.length), 360, 360, 180);

        bezier(
            // anchor 1 x,y
            0,
            vMin + vOffset,
            // control point 1
            muse[bandname][0] * width,
            map(muse[bandname][1], 0, 1, vMax, vMin),
            // control point 2
            muse[bandname][2] * width,
            map(muse[bandname][3], 0, 1, vMax, vMin)
            // anchor 2
            width,
            vMin + vOffset
        )
    }

}
