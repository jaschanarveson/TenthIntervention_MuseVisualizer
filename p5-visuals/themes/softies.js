var Softies = function (numAcross) {

    var self = this;

    self.bandNames = ['delta', 'theta', 'alpha', 'beta', 'gamma'];
    colorMode(RGB, 255);
    self.bandColors = [
        color(255, 170, 170, 123),
        color(255, 255, 170, 122),
        color(170, 255, 170, 122),
        color(170, 255, 255, 122),
        color(255, 170, 255, 122)
    ];
    self.num = numAcross;

    self.draw = function () {
        colorMode(RGB, 255);
        background(0);


        var r = width / self.num / 2; // r = the 'radius' of the square, from center to corner
        var count = 0;
        var rownum = 0;
        var rotateDepth = map(muse.concentration, 0, 1, 0, 20);

        var pointArrays = [];
        var tightnesses = [];

        for (var i = 0; i < 5; i++) {
            var name = self.bandNames[i];
            var rMods = [];
            for (var j = 0; j < 4; j++) {
                // the 4 sensor vals drive length of the diagonals
                rMods.push(r * map(muse[name][j], 0, 1, 0.9, 1.2));
            }
            var points = [
                [0 - rMods[0], 0],
                [0, 0 - rMods[1]],
                [0 + rMods[2], 0],
                [0, 0 + rMods[3]]
            ];
            pointArrays.push(points);

            var bandavg = muse.bandAverages[name];
            tightnesses.push(map(bandavg, 0, 1, 0.5, 1.3));
        }



        for (var y = 0; y < height + r; y += r) {
            var xstart = 0;
            if ((rownum % 2) === 1) {
                xstart += r;
            }
            for (var x = xstart; x < width + r; x += 2 * r) {
                var points = pointArrays[count % 5];

                push();
                fill(self.bandColors[count % 5]);
                noStroke();
                curveTightness(tightnesses[count % 5]);
                translate(x, y);
                rotate(radians(map(muse.mellow, 0, 1, -rotateDepth, rotateDepth)));
                rotate((PI/2) * (count % 4));
                beginShape();
                for (var i = 0; i < points.length + 3; i++) {
                    var p = i % points.length;
                    curveVertex(points[p][0], points[p][1]);
                }
                endShape(CLOSE);
                pop();

                count++;
            }
            rownum++;
        }
    }
}
