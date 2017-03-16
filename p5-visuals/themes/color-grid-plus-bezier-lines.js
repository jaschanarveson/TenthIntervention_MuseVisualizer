function color_grid_plus_bezier_lines() {
    var gridmin = min([width / 128], [height / 128]);
    var gridmax = min([width / 2, height / 2]);
    var x_spacing = map(muse.concentration, 0, 1, gridmin, gridmax);
    var y_spacing = map(muse.mellow, 0, 1, gridmin, gridmax);

    strokeWeight(1);

    colorMode(RGB, 255);
    background(255);

    var maxSquares = (width / gridmin) * (height / gridmin);

    colorMode(HSB, maxSquares);
    rectMode(CENTER);

    var longestLine = dist(0, 0, width / 2, height / 2);


    //    push();
    //    translate(width / 2, height / 2);

    var squaresWide = floor(width / x_spacing);
    var squaredHigh = floor(height / y_spacing);
    console.log(squaresWide, squaredHigh);
    var centerX = width / 2;
    var centerY = height / 2;

    for (var x = centerX - (squaresWide * x_spacing); x < width + x_spacing; x += x_spacing) {
        for (var y = centerY - (squaredHigh * y_spacing); y < height + y_spacing; y += y_spacing) {

            stroke(map(dist(x, y, centerX, centerY), 0, longestLine, 0, maxSquares), maxSquares / 2, maxSquares / 2, maxSquares / 2);
            fill(map(dist(x, y, centerX, centerY), 0, longestLine, 0, maxSquares), maxSquares / 2, maxSquares / 2, maxSquares / 2);
            rect(x, y, x_spacing, y_spacing);
        }
    }

    //    pop();

    colorMode(HSB, 360);

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
