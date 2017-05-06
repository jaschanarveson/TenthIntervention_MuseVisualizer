function create_dorian_movie(movpath) {
    var self = this;

    self.movie = createVideo(movpath, function () {
        console.log(movpath + " loaded");
    });
    self.movie.hide();
    self.movie.stop();

    self.draw = function () {
        colorMode(RGB, 255);
        background(123);
        text("i shouldn't be able to see this", 300, 300);
        image(self.movie, 10, 10);
    };

    self.play = function () {
        console.log("playing movie " + movpath);
        console.log(self.movie);
        self.movie.play();
    }

    self.stop = function () {
        console.log("stopping movie " + movpath);
        self.movie.stop();
    }
}
