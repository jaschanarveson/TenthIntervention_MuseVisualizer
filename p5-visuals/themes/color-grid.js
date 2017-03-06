function color_grid() {
    var gridmin = min([width / 128], [height / 128]);
    var gridmax = min([width / 2, height / 2]);
    var x_spacing = map(muse.concentration, 0, 1, gridmin, gridmax);
    var y_spacing = map(muse.mellow, 0, 1, gridmin, gridmax);

    colorMode(RGB, 255);
    background(123);

    var maxSquares = (width / gridmin) * (height / gridmin);

    stroke(255, 255, 255, 0);
    strokeWeight(2);

    colorMode(HSB, maxSquares);
    rectMode(CENTER);
    
    var longestLine = dist(0, 0, width/2, height/2);


    push();
    translate(width / 2, height / 2);

    var sqH = 0;
    var sqS = maxSquares;
    var sqB = maxSquares;

    for (var x = 0; x < width / 2 + x_spacing; x += x_spacing) {
        for (var y = 0; y < height / 2 + y_spacing; y += y_spacing) {
            
            fill(map(dist(x, y, 0, 0), 0, longestLine, 0, maxSquares), maxSquares/2, maxSquares/2, maxSquares/2);
            rect(x, y, x_spacing, y_spacing);

            fill(map(dist(x, -y, 0, 0), 0, longestLine, 0, maxSquares), maxSquares/2, maxSquares/2, maxSquares/2);
            rect(x, -y, x_spacing, y_spacing);

            fill(map(dist(-x, y, 0, 0), 0, longestLine, 0, maxSquares), maxSquares/2, maxSquares/2, maxSquares/2);
            rect(-x, y, x_spacing, y_spacing);

            fill(map(dist(-x, -y, 0, 0), 0, longestLine, 0, maxSquares), maxSquares/2, maxSquares/2, maxSquares/2);
            rect(-x, -y, x_spacing, y_spacing);
        }
    }

    pop();
}
