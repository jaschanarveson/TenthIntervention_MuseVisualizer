# TenthIntervention_MuseVisualizer
Visualizing OSC data from the Muse headband for the Tenth Intervention concert on May 5, 2017.

## What's the this project
- Two Node.js apps: **appA.js** and **appB.js**
  - **appA.js** receives OSC data from the Muse headband on port 5000, processes it, and sends only selected data to **appB.js** on port 8888
  - **appB.js** receives OSC from *appA.js* on port 8888 and forwards it to the **p5.js** sketch running in the browser
- A **p5.js** project that's running the actual visualization code
- A folder called **z-test-data** that contains some recordings made with the Muse headband - these can be replayed via command-line and will trigger a stream of data that matches the original Muse stream.  Good for testing!

## Installing and running this project
(To be continued)
