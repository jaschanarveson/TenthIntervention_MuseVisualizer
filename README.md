# TenthIntervention_MuseVisualizer
Visualizing OSC data from the Muse headband for the Tenth Intervention concert on May 5, 2017.

The idea is that each piece on the show will feature a different way of visualizing data from the Muse headband, which will be worn by a member of the group (or a friend/volunteer) throughout the show.

Here'a a list of adjectives and composer names for the four pieces that need visualizations.  Since these are all premieres, there are no recordings of them - links to reference tracks that capture something of a similar mood are listed below, as well.  The reference track for Daniel Felsenfeld was sent as a Dropbox link in a private email that you should have.

Composer: Tonia Ko - (Ecstasy)
sounds like:  [https://www.youtube.com/watch?v=P-SMSWXz58w](https://www.youtube.com/watch?v=P-SMSWXz58w)

Composer: Kate Soper - (Anxiety)
sounds like:  [https://vimeo.com/50375211](https://vimeo.com/50375211)

Composer: Dorian Wallace - (Fear)
sounds like (part 1):  [https://www.youtube.com/watch?v=MRb1-SAAIzs](https://www.youtube.com/watch?v=MRb1-SAAIzs)
sounds like (part 2):  [https://www.youtube.com/watch?v=wtZSdCqTmhI](https://www.youtube.com/watch?v=wtZSdCqTmhI)

Composer: Daniel Felsenfeld - (Sensuality)



## Organization
This project is set up as a p5.js sketch where the `draw()` loop selects a visualizing function (which I'm calling a **theme**) from the `p5-visuals/themes` folder.  Keyboard shortcuts are set up to allow for easy switch between the themes.  The ultimate idea is one theme per piece.

The `sketch.js` file establishes globar variables that will the shared by all the themes, in particular the **muse** object, which holds all the updated data from the Muse headband.

Right now, the **muse** object has the following data:

- accelerometer data on the x, y, z axes, range: [0, 1], freq: 50Hz
- "session score" data for the five brain frequencies: delta, theta, alpha, beta, gamma.  These are 4-value arrays with a number from [0,1] for each of the four sensors on the headband.  The "session score" numbers are cumulative, with 0 representing the bottom 10% of the value's history, 1 representing the top 10%, and intermediate values mapped linearly.  This seemed like the most useful value to use - the Muse headband also offers raw band power values for these five ranges as well as a "relative band power" score which reflects the weighting of the bands relative to eachother moment by moment.
- a object called **bandAverages** which contains the average of the 4 sensors for each of the five bands
- two experimental values from the Muse company called **concentration** and **mellow** in the range [0,1]

There are Node.js apps running the background that are filtering and processing the OSC data from the Muse headband - this is split into two parts to allow for distributing the load across two computers, since reading the Muse and running the p5 sketch are both CPU intensive enough that I don't want to have it all happening on one machine during the concert.  Many OSC streams from the Muse run at 10Hz, and the Node.js apps interpolates this data to a smoother 60Hz.

## What's in this project
- Two Node.js apps: **appA.js** and **appB.js**
  - **appA.js** receives OSC data from the Muse headband on port 5000, processes it, and sends only selected data to **appB.js** on port 8888.  Interpolation from 10Hz to 60Hz is done here.
  - **appB.js** receives OSC from **appA.js** on port 8888 and forwards it to the **p5.js** sketch running in the browser
- A **p5.js** project that's running the actual visualization code
- A folder called **z-test-data** that contains some recordings made with the Muse headband - these can be replayed via command-line and will trigger a stream of data that matches the original Muse stream.  Good for testing!
- four Bash executables (filenames starting with 01, 02, 03, and 04) that can be run together to start launch the Muse recording, the Node apps, and the p5 sketch.

## Installing and running this project
1. download and install the [Muse Research Tools](http://developer.choosemuse.com/research-tools)
2. download this project (obviously...)
3. cd to the project directory and run `npm install` to get the dependencies defined in `package.json`
4. select and double-click the four Bash executables (the four .command files starting with 01, 02, 03, and 04) - everything should just work (you may need to run `chmod 777` on these four files on your own computer to get them to work)
5. current keyboard shortcuts:
  - t = toggle text overlay
  - f = toggle fullscreen mode
  - [1,2,3,4] number keys toggle example sketches 1, 2, 3, and 4
  
## Adding a new theme
- create a new .js file in the `p5-visuals` folder and name it according to your theme, eg: `my_lovely_theme.js`
- define a function in this file give the function the name you want your theme to have, eg: 
```
function my_lovely_theme() {
  // p5 code goes here
}
```
- access the data by calling properties from the **muse** object, eg: x-accelerometer data is at `muse.x`, while the four-value array of sensor data for the alpha waves is at `muse.alpha`, etc.
- add a `<script>` tag in the `p5-visuals/index.html` file to load your theme
- set up a new keyboard shortcut for your theme in the `p5-visuals/sketch.js` file

## Playing other Muse recordings:
`cd` to the directory with the recording in it and run this:
```
muse-player -f NAME_OF_FILE.muse -s osc.udp://localhost:5000
```
