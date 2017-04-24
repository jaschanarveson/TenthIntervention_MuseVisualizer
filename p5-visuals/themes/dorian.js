function create_dorian_theme() {
    var self = this;

    self.img = loadImage(
        'media/wolf-in-suit.png',
        function () {
            console.log("dorian image loaded");
            self.resetPixelArray();
        }
    );

    self.resetPixelArray = function () {
        self.img.resize(width, height);
        self.img.loadPixels();
    };

    self.draw = function () {
        colorMode(RGB, 255);
        rectMode(CORNER);
        strokeWeight(1);

        background(0);


        var bands = ["delta", "theta", "alpha", "beta", "gamma"];

        stroke(255, 0, 0, 123);
        fill(255, 0, 0, 123);

        push();
        translate(width / 3, 0);
        rotate(radians(45));

        for (var i = 0; i < bands.length; i++) {
            var thisBand, nextBand;
            thisBand = muse[bands[i]];
            nextBand = muse[bands[(i + 1) % bands.length]];

            scale(map(muse.concentration, 0, 1, 0.9, 1.5), map(muse.mellow, 0, 1, 0.8, 1));

            bezier(
                thisBand[0] * width,
                nextBand[0] * height,
                thisBand[1] * width,
                nextBand[1] * height,
                thisBand[2] * width,
                nextBand[2] * height,
                thisBand[3] * width,
                nextBand[3] * height
            );


            bezier(
                nextBand[0] * width,
                thisBand[0] * height,
                nextBand[1] * width,
                thisBand[1] * height,
                nextBand[2] * width,
                thisBand[2] * height,
                nextBand[3] * width,
                thisBand[3] * height
            );

        }

        pop();

        loadPixels();
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var indx = (y * width + x) * 4;
                if (pixels[indx] > 123) {
//                    var half = Math.floor(self.img.pixels[indx] / 2);
                    pixels[indx] = self.img.pixels[indx];
                    pixels[indx + 1] = 0; // self.img.pixels[indx + 1];
                    pixels[indx + 2] = 0; // self.img.pixels[indx + 2];
                    pixels[indx + 3] = 123; // self.img.pixels[indx + 3];
                }
            }
        }
        updatePixels();
    };

    return self;
}
