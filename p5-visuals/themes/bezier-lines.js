function bezier_lines() {
    colorMode(HSB, 255);
    background(123);

    var a1x = muse.concentration * width / 2;
    var a1y = muse.concentration * height;
    var c1x = muse.bandAverages.delta * width;
    var c1y = muse.bandAverages.theta * height;
    
    var a2x = (muse.mellow * width / 2) + width / 2;
    var a2y = muse.bandAverages.gamma * height;
    var c2x = muse.bandAverages.alpha * width;
    var c2y = muse.bandAverages.beta * height;
    
    stroke(255);
    strokeWeight(2);
    fill(0);
    bezier(a1x, a1y, c1x, c1y, c2x, c2y, a2x, a2y);
//    noStroke();
//    fill(200, 200, 0);
//    ellipse(c1x, c1y, 8, 8);
//    fill(0, 200, 200);
//    ellipse(c2x, c2y, 8, 8);
}