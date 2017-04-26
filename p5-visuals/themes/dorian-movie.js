function create_dorian_movie(movpath) {
    var self = this;

    self.movie = createVideo([movpath]);
    self.movie.hide();

    self.draw = function () {
        background(0);
        image(self.movie, 0, 0);
    }
}
