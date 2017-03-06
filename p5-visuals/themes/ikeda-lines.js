var Ikeda_lines = function (divs) {
        var self = this;
        self.divs = divs || 20;
        self.offsets = [0, 0, 0, 0, 0];

        self.draw = function () {
            background(123);
            colorMode(HSB, 255);
            
            var bandAvgs = [
                muse.bandAverages.delta, 
                muse.bandAverages.theta, 
                muse.bandAverages.alpha, 
                muse.bandAverages.beta, 
                muse.bandAverages.gamma
            ];

            // calculate based on possible changing window size
            var wStep = width / self.divs;
            var stripeHeight = height / bandAvgs.length;
            var colorStep = 255 / self.divs;


            // draw one stripe per band
            for (var stripe = 0; stripe < bandAvgs.length; stripe++) {
                var xvel = map(bandAvgs[stripe], 0, 0.8, -5, 5);
                var y = stripe * stripeHeight;
                self.offsets[stripe] = (self.offsets[stripe] + xvel + width) % width;

                // draw this.divs number of boxes in the stripe
                for (var box = 0; box < self.divs; box++) {
                    var theX = (wStep * box + self.offsets[stripe] + width) % width;
                    var shade = box * colorStep;
                    fill(shade);
                    noStroke();
                    rectMode(CORNER);
                    if (theX > width - wStep) {
                        var diff = width - theX;
                        rect(theX, y, diff, stripeHeight);
                        rect(0, y, wStep - diff, stripeHeight);
                    } else {
                        rect(theX, y, wStep, stripeHeight);
                    }
                }
            }

        }
    }

