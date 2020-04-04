//Keep the fetched data 
var data = null;
var selector = d3.select("#selDataset");

//Program is started from Init 
function init() {

  //Make a requestion to samples.json
  d3.json("static/data/samples.json").then((dataJson) => {
    //console.log(dt);

    //assign data json object to data
    data = dataJson;
    //load dropdown selector
    initDataset(data);

    //init dashboard
    loadDashboard(selector.node().value);
  });
}
/*################################################################*/

//load the dataset dropdown and binding event
function initDataset(data)
{
  //get data
  let sampleNames = data.names;
  //load data
  sampleNames.forEach((sample) => {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });
  //binding event
  selector.on("change", selectorHandler );
}
//handle selector
function selectorHandler()
{
  newSample=this.value;
  loadDashboard(newSample);
}
//load a new data into Dashboard
function loadDashboard(newSample)
{
  buildMetadata(newSample);
  buildCharts(newSample);
}
/*################################################################*/
//load a new details DIV= #sample-metadata
function buildMetadata(sample) {

    var metadata = data.metadata;
    //more efficient way use find
    var result = metadata.find(sampleObj => sampleObj.id == sample);

    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    Object.entries(result).forEach(([key,value]) =>
          PANEL.append("h6").text(`${key}:${value}`)
    );
}
//load Charts
function buildCharts(sample){
   top10BacterialSpecies(sample);
   bubbleBacterialSpecies(sample);
   gaugeFrequencyWash(sample);
}
/*################################################################*/
//load a bar Chart DIV = #bar
function top10BacterialSpecies(sample){
   //get data
   let sampledata = data.samples;
   //find first match sample id
   let result = sampledata.find(sampleObj => sampleObj.id == sample);
   //assign arrays
   let sample_values = result.sample_values.slice(0,10).reverse();
   let otu_ids = result.otu_ids.slice(0,10).map( value=> `OTU ${value}`).reverse();
   let otu_labels = result.otu_labels.slice(0,10).map(value=> value.replace(/;/gi,"<br>")).reverse();
   //create trace data with above array
   let traceData = [
     {
       y: otu_ids,
       x : sample_values,
       text: otu_labels,
       type: 'bar',
       orientation: 'h'
     }
   ]
   //setup layout
   let layout={
    hoverlabel: { bgcolor: "#1FBED6" }
   }
   //plot
   Plotly.newPlot("bar",traceData,layout)
}
//load a bubble chart DIV = #bubble
function bubbleBacterialSpecies(sample){
  //get data
  let sampledata = data.samples;
  //find first match sample id
  let result = sampledata.find(sampleObj => sampleObj.id == sample);
  //assign arrays
  let sample_values = result.sample_values;
  let otu_ids = result.otu_ids;
  let otu_labels = result.otu_labels.map(value=> value.replace(/;/gi,"<br>"));
  //create trace data with above array
  let traceData = [
    {
      x: otu_ids,
      y : sample_values,
      text: otu_labels,
      mode: 'markers',
      marker:{
          size: sample_values,
          color: otu_ids,
          colorscale : "Earth"
      }
    }
  ];
  //setup layout
  let layout={
   hoverlabel: { bgcolor: "#1FBED6" }
  }
  //plot 
  Plotly.newPlot("bubble",traceData,layout)
}
//load a bar Gauge DIV = #gauge
function gaugeFrequencyWash(sample)
{
  //get data
  let metadata = data.metadata;
  //find first match sample id
  let result = metadata.find(sampleObj => sampleObj.id == sample);
  //create trace data with above array
  let traceData = [
    {
      type: "indicator",
      mode: "gauge+number",
      title: { "text": "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      value: result.wfreq,
      delta:{ reference: 0 },
      gauge: {
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          axis: { range: [null, 9],
            ticks:"inside",
            tickwidth:0,
            ticklen:0,
            tickmode:"array",
            tickvals:[0,1,2,3,4,5,6,7,8,9],
            showticklabels:true
           },
          bar: { color: "red", thickness: 0.2 },
          borderwidth: 0,
          steps: [
            { range: [0, 1], color: "#FCFCEC" },
            { range: [1, 2], color: "#F0F0E0" },
            { range: [2, 3], color: "#E9E6CA" },
            { range: [3, 4], color: "#E5E7B3" },
            { range: [4, 5], color: "#D5E49D" },
            { range: [5, 6], color: "#B7CC92" },
            { range: [6, 7], color: "#8CBF88" },
            { range: [7, 8], color: "#8ABB8F" },
            { range: [8 ,9], color: "#85B48A" }
          ]
          }
  }
  ]
  //plot
  Plotly.newPlot("gauge",traceData);
}
/*################################################################*/
//Run the javascript
init();