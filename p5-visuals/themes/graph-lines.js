function graph_lines() {
    colorMode(HSB, 360);
    textAlign(LEFT);
    textSize(24);
    textFont("Courier");
    background(123);


    var bandnames = ["delta", "theta", "alpha", "beta", "gamma"];
    var bandheight = height / (bandnames.length + 1);
    var vOffset = bandheight / 2;
    var hspacing = width / 10;
    var hOffset = hspacing * 2;

    for (var i = 0; i < bandnames.length; i++) {
        var top = (bandheight * i) + vOffset;
        var name = bandnames[i];
        fill(72 * i, 360, 360);
        text(name, 0, top + (bandheight/2)); // print band name
        for (var j = 0; j < muse[name].length; j++) {
            var bval = muse[name][j];
            var left = hspacing * j + hOffset;
            var barHeight = map(bval, 0, 1, 0, bandheight);
            var barTopOffset = bandheight - barHeight;
            rect(left, top + barTopOffset, hspacing / 2, barHeight);
        }
    }
}
