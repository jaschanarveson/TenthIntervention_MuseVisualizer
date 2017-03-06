function test_circles() {
    colorMode(HSB, 360);
    strokeWeight(1);

    // blink and jaw clench effect

    background(0, muse.jaw * 20, 180 + (muse.blink * 40));
    textAlign(CENTER);
    textSize(10);
    textFont('Monaco');


    // draw x y z

    stroke(0, 0, 300);
    line(muse.x * width, 0, muse.x * width, height);
    line(0, muse.y * height, width, muse.y * height);
    noFill();
    ellipse(muse.x * width, muse.y * height, muse.z * 100, muse.z * 100);
    stroke(0, 0, 0);



    //draw 6 cirlces for the bands

    var xstep = width / 3;
    var ystep = height / 2;
    var diam = min([xstep, ystep]);
    var ringDiam = diam/2;

    var bands = ['delta', 'theta', 'alpha', 'beta', 'gamma'];

    for (var circ = 0; circ < bands.length; circ++) {
        var tempAngle = radians((360 / bands.length) * circ);
        var tempx = cos(tempAngle) * ringDiam + width / 2;
        var tempy = sin(tempAngle) * ringDiam + height / 2;
        var propName = bands[circ];
        fill(circ * 60, 360, 360, 220);
        ellipse(tempx, tempy, diam * muse.bandAverages[propName], diam * muse.bandAverages[propName]);
        fill(0, 0, 0);
        text("avg " + propName, tempx, tempy);
    }


    // draw wandering dot for concentration and mellow

    fill(20, 360, 360, 180);
    ellipse(muse.concentration * width, muse.mellow * height, 100, 100);
    fill(0, 0, 0);
    text('c&m', muse.concentration * width, muse.mellow * height);
}