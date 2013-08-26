#Raggiana
##Stand-alone Finagle Stats Viewer

###Overview

Raggiana exists to provide a fast, easy, and intuitive way to view and process data from Finagle projects. Finagle projects create a log file containing dense json data. Raggiana parses this data and graphs it using the Rickshaw javascript library.

###Getting Started

#####Download
Download Raggiana! The Github page is <https://github.com/twitter/raggiana>. Navigate to the directory where you would like to place Raggiana and run:

	$ git clone https://github.com/twitter/raggiana
	
Raggiana uses the Bower package manager (<https://github.com/bower/bower>). To load the dependencies, run

	$ npm install bower //if you don't already have bower on your machine
	$ bower install

Bower will place the dependencies in a new directory called `bower_components`. You're now good to go!

#####Open it
Since Raggiana is javascript-based, you use it in your browser. Open a new tab and enter in the url bar:

	file://localhost/filepath/raggiana/statsViewer.html
	
You should see an empty stats viewer, with controls on the left and some boxes at the bottom that say things like "metrics" and "graph." To upload some data, find the button that says __"Choose File"__. Click it, and it will allow you to choose a file to upload.

Raggiana provides some nice sample data for you in `raggiana/examples`. Try uploading the provided `hello_log.txt`.

__Note__: stats logs do not have to be .txt files. Most Finagle projects produce output files resembling: `job_name-stats.log`.

#####Graph it
When you upload your file, you should see that the __Metrics__ box has been populated with all the different statistics and metrics found in the data file. To add a metric to the graph, click on it or drag it to the __graph metrics__ box. Move "hello1" and "hello2" to the Graph Metrics box. Look! The graph says hi! That was a silly example, let's try a better one. Click the __"Choose File"__  button again, and this time open `examples/example_data.log`. 

#####Play with it
There are all kinds of ways to manipulate your graphs. Try all the buttons! You can:

* trace graphs to see point values
* toggle visibility for each metrics in the legend (upper left)
* change graph type (area, bar, line, plot)
* change line type (cardinal, linear, bar)
* see data stacked or in a stream, or as percentage values.
* use the "smoother" bar to smooth the graph
* use the range bar (underneath the graph) to zoom in on a specific area

###Testing

If you're developing with Raggiana and you want to run tests, it's easy! From your raggiana directory, run 

	$ npm install
	$ npm test

You can edit the tests and add your own by modifying __runTests.js__ or by writing a new test file and adding it to the __"files"__ field in __karma.conf.js__.  

###Troubleshooting

######Problems uploading file:
If your data file has changed and you wish to load the new data, you may need to refresh the page before uploading again. 

######Slow performance:
For huge data (tens of thousands of data points), performance may become slow. Using the __smoothing__ bar can effectively reduce the size of the data and make manipulation much faster. Alternatively, using the range bar to limit the scope of the graph will also speed up performance.

###Feedback
Bugs? Confusion? Raise an issue on github: <https://github.com/twitter/raggiana/issues>.




