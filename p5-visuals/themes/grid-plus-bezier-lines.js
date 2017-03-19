function grid_plus_bezier_lines() {
    strokeWeight(1);
    colorMode(HSB, 360);

    background(180);

    var gridmin = min([width / 64], [height / 64]);
    var gridmax = min([width / 2, height / 2]);
    var x_spacing = map(muse.concentration, 0, 1, gridmin, gridmax);
    var y_spacing = map(muse.mellow, 0, 1, gridmin, gridmax);
    var numWide = ceil(width/x_spacing);
    var numHigh = ceil(height/y_spacing);

    var centerX = width / 2;
    var centerY = height / 2;

    stroke(190, 0, 190, 123);
    fill(123, 0, 123, 123);

    var startX = centerX - ceil(numWide/2) * x_spacing;
    var startY = centerY - ceil(numHigh/2) * y_spacing;

    for (var x = startX; x < width + x_spacing; x += x_spacing) {
        for (var y = startY; y < height + y_spacing; y += y_spacing) {
            line(x, 0, x, height);
            line(0, y, width, y);
        }
    }

    // bezier lines

    var bands = ["delta", "theta", "alpha", "beta", "gamma"];

    for (var i = 0; i < bands.length; i++) {
        var bandname = bands[i];

        fill(360 * (i / bands.length), 360, 360, 60);
        stroke(360 * (i / bands.length), 360, 360, 60);
        //        fill(0, 0, 0, 100);
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
