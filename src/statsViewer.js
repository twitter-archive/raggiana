/*
--Copyright 2013 Twitter, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

(function(parent) {
  var myData = [];       //myData is always ALL the data from the uploaded file
  var availableMetrics = [];
  var firstTime = true;
  var drop1 = document.getElementById("dropzone1");
  var drop2 = document.getElementById("dropzone2");
  var graphLegend = document.getElementById("legend");
  var graphChart = document.getElementById("chart");
  var graphTimeline = document.getElementById("timeline");
  var finalData = [];
  parent.Raggiana = {
    readSingleFile : function(evt) {
      //Retrieve the first (and only!) File from the FileList object
      var f = evt.target.files[0]; 
      if (f) {
        var r = new FileReader();
        r.onload = function(e) {
         try {
            finalData = [];
            var contents = e.target.result;
            var inputData = Raggiana.parseContents(contents, "INF");
            myData = Raggiana.parseData(inputData);
            drop1.innerHTML = "";
            drop2.innerHTML = "";
            graphLegend.innerHTML = "";
            graphChart.innerHTML = "";
            graphTimeline.innerHTML = "";
            Raggiana.makeMetricSelector();
            availableMetrics = drop2.innerHTML;
          } catch (err) {
            alert("Could not read file. " + err.message);
          }
        }
        r.readAsText(f);
      } else { 
        alert("Failed to load file");
      }
    },

    /*
    parseContents is called when the data file is uploaded. It takes the contents of the uploaded file and returns an array: time => {data}
    */
    parseContents : function(dataText, target) {
      var regexp = new RegExp("^" + target + " \\[(.*?)\\] stats: (.*)");
      return dataText.split('\n').map(function(line) {
        var match = line.match(regexp);
        if (match) {
          return { "date" : match[1], "data" : JSON.parse(match[2]) };
        }
      });
    },

    /*
    parseData is called during file upload/processing. It takes an array of data strings and json-ifies it. 
    This function may need to be made more flexible if it turns out finagle stats logs aren't all formatted the same.
    */
    parseData : function (input) { 
      var data = [];                        //data: field => [{x:time,y:value},{x:time,y:value},...]
      input.forEach(function(entry, index) {
        if (entry) {
          var time;
          if (entry.data.timestamp) {
            time = entry.data.timestamp;
          } else {
            time = index;
          }
          Object.keys(entry.data).forEach(function(field) {
            if (!data[field]) {
              data[field] = [];
            }
            data[field].push({x:time, y:entry.data[field]});
          });
        }
      });
      return data;
    },

    /*
    makeMetricSelector is called when the data is uploaded. It makes the data selection menu using the fields it finds in the data.
    */
    makeMetricSelector : function () {
      for (field in myData){
        drop2.innerHTML += "<div id=" + field + " draggable='true' ondragstart='Raggiana.drag(event)' class='metric' onclick='Raggiana.metricClick(this)'>" + field + "</div>";
      }
    },
        
    metricClick : function (met) {
      if (met.parentNode.id === "dropzone2") {
        drop1.appendChild(met);
        finalData[met.id] = myData[met.id];
      } else {
        drop2.appendChild(met);
        finalData[met.id] = undefined;
      }
      Raggiana.doEverything(finalData);
    },

    /*
    drag and drop data manipulation lives here
    */
    allowDrop : function (ev) {
      ev.preventDefault();
    },

    drag : function (ev) {
      ev.dataTransfer.setData("Text", ev.target.id);          
    },

    drop : function (ev, list) {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("Text");
      var dropzone = "";
      if (list == 1) {
        dropzone = drop1;
        finalData[data] = myData[data];
      } else {
        dropzone = drop2;
        finalData[data] = undefined;
      }
      dropzone.appendChild(document.getElementById(data));
      Raggiana.doEverything(finalData);            
    },

    /*
    makeDataSeries is called by doEverything to format the data into graphable form.
    */
    makeSeriesData : function (d) { //d is data: field => [{x:time,y:value}]
      var palette = new Rickshaw.Color.Palette( { scheme: "classic9" } );
      var series = [];
      var i =0;
      for (field in d) {
          if (d[field] && field != "service" && field != "source") {
          series[i] = {color:palette.color(),data:d[field],name:field};
          i++;
        }
      }
      Rickshaw.Series.zeroFill(series);     
      return series;
    },

    /*
    called when the make graph button is clicked. Takes finalData, makes the graph, and renders it.
    */
    doEverything : function (data) {
      //reset legend and graph
      graphLegend.innerHTML = "";
      graphChart.innerHTML = "";
      graphTimeline.innerHTML = "";
      // instantiate our graph!
      var graph = new Rickshaw.Graph( {
      element: document.getElementById("chart"),
      width: 900,
      height: 500,
      renderer: "line",
      stroke: true,
      preserve: true,
      series: Raggiana.makeSeriesData(data)
      });

      graph.render();

      var slider = new Rickshaw.Graph.RangeSlider( {
      graph: graph,
      element: $("#slider")
      } );

      var hoverDetail = new Rickshaw.Graph.HoverDetail( {
      graph: graph
      } );

      var legend = new Rickshaw.Graph.Legend( {
      graph: graph,
      element: document.getElementById("legend")
      } );
        
      var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
      graph: graph,
      legend: legend
      } );

      var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
      graph: graph,
      legend: legend
      } );

      var smoother = new Rickshaw.Graph.Smoother( {
      graph: graph,
      element: $("#smoother")
      } );

      var ticksTreatment = "glow";

      var xAxis = new Rickshaw.Graph.Axis.Time( {
      graph: graph,
      ticksTreatment: ticksTreatment
      } );

      xAxis.render();

      var yAxis = new Rickshaw.Graph.Axis.Y( {
      graph: graph,
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
      ticksTreatment: ticksTreatment
      } );

      yAxis.render();

      var controls = new RenderControls( {
      element: document.querySelector("form"),
      graph: graph
      } );
    }
  };

  /*
  Search for metrics! Invariants: no metric appears more than once in the metric selector form, search returns all available 
  */
  $(document).ready(function() {
    $("#search").change(function(evt) {
      evt.preventDefault();
      var that = this;
      var $drop2 = $(drop2);
      drop2.innerHTML = availableMetrics;
      //results of the search are all metrics that contain the search string and are not already being graphed.
      var results = $drop2.children().filter(function(index, elem) { 
        return elem.innerHTML.indexOf(that.value) >= 0 && drop1.innerHTML.indexOf(elem.innerHTML) < 0; 
      });
      drop2.innerHTML = "";
      $drop2.append(results);
    });   
  });
})(window);
