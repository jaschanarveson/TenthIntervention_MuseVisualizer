function create_dorian_movie(movpath) {
    var self = this;

    self.movie = createVideo(movpath, function () {
        console.log(movpath + " loaded");
    });
    self.movie.hide();
    self.movie.pause();

    self.draw = function () {
        colorMode(RGB, 255);
        background(123);
        image(self.movie, 0, 0);
    };

    self.go = function () {
        self.movie.loop();
//        self.movie.time(0);
    }

    self.stop = function () {
        self.movie.stop();
    }
}
