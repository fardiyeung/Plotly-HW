function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  
  d3.json(`/metadata/${sample}`).then(data => {
  // console.log(Object.entries(data));
  var WFREQ = +data['WFREQ'];
  var metaDataPanel =  d3.select("#sample-metadata")
  

  console.log(`WFREQ: ${WFREQ}`);
  metaDataPanel.html("")
 
    Object.entries(data).forEach(([key, value])=>{
      metaDataPanel
        .append("h6").text(`${key}: ${value}`);
      
    });
    
  buildGauge(WFREQ);
  });

    
}

function buildGauge(WFREQ){
// Enter a speed between 0 and 180
var level = WFREQ * 180 / 9;

// Trig to calc meter point
var degrees = 180 - level,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
  rotation: 90,
  text: ['8 - 9', '7 - 8', '6 - 7', '5 - 6', '4 - 5', '3 - 4', '2 - 3', '1 - 2', '0 - 1'
        ],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(40, 154, 22, .5)',
                         'rgba(70, 202, 42, .5)', 'rgba(100, 209, 95, .5)',
                         'rgba(130, 206, 145, .5)', 'rgba(160, 226, 202, .5)',
                         'rgba(190, 255, 255, .5)', 'rgba(215, 255, 255, .5)', 
                         'rgba(235, 255, 255, .5)', 'rgba(255, 255, 255, 0)']},
  labels: ['8 - 9', '7 - 8', '6 - 7', '5 - 6', '4 - 5', '3 - 4', '2 - 3', '1 - 2', '0 - 1', ''
  ],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];
var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Belly Button Washing Frequency (Scrubs Per Week)',
  height: 600,
  width: 600,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(data => {

    var sample_values = data.sample_values;
    var otu_ids = data.otu_ids;
    var otu_labels = data.otu_labels;


    var trace1 = {
      labels : otu_ids.slice(0,10),
      values : sample_values.slice(0,10),
      hovertext : otu_labels.slice(0,10),
      type: "pie"
    }
    
    var data = [trace1];
    
    var layout = {
      height: 450,
      width: 450
      // title: "Pie Chart",
    };
    Plotly.newPlot("pie", data, layout);

    var trace2 = {
      x: otu_ids.slice(0,10),
      y: sample_values.slice(0,10),
      text: otu_labels.slice(0,10),
      mode: "markers",
      marker: {
        size:sample_values.slice(0,10),
        color: otu_ids.slice(0,10),
        sizeref: 0.25,

      }
    };

        
    var data2 = [trace2];

    var layout2 = {
      // title: 'Marker Size',
      xaxis: {title: 'otu id'},
      showlegend: false,
      height: 600,
      width: 1000
    };
    
    Plotly.newPlot('bubble', data2, layout2);
    

  });
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log("in event");
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
