// Get the Path url
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

//Get json data from url
d3.json(url).then(function(data){
    console.log(data);
});

// Initialize function to create dropdown, bar chart and a buble chart
function init(){
    //create variable for dropdown list
    let dropdown = d3.select("#selDataset");
    //get the sample datan usinh d3 library
    d3.json(url).then((data) => {
    //get the sample ids from the data, to add it to dropdown
    let sample_ids = data.names;
    console.log(sample_ids);
        for (id of sample_ids){
            dropdown.append("option").attr("value", id).text(id);
        };
    //storing first sample
    let first  = sample_ids[0];
    console.log(first);

    });
};

//create a function to populate horizontal bar chart

function  barChart(sample){
    //Get json data from url
    d3.json(url).then((data) => {
       let sample_data= data.samples;
       //only get the sample ids that matches the value
       let results= sample_data.filter(id => id.id == sample);
       //storing first sample
       let first_result = results[0];
       console.log(first_result);
       //storign first 10 results to plot the horizontal bar chart
       let sample_values = first_result.sample_values.slice(0,10);
       let otu_ids = first_result.otu_ids.slice(0, 10);
       let otu_labels = first_result.otu_labels.slice(0,10);
       console.log(sample_values);
       console.log(otu_ids);
       console.log(otu_labels);
       
       //create trace for our bar chart
       let trace1 = {
        x: sample_values.reverse(),
        y: otu_ids.map(item => `OTU ${item}`).reverse(),
        text: otu_labels.reverse(),
        type: 'bar',
        orientation: 'h',
       };

       let layout = {title: "Top 10 OTUs"};
       Plotly.newPlot("bar", [trace1], layout);
    });
};

//create a function to populate bubble graph
function bubbleGraph (sample){
    /////Get json data 
    d3.json(url).then((data) => {
        
        let sample_data = data.samples;
        //only get the sample ids that matches the value
        let results = sample_data.filter(id => id.id ==  sample);

        //storing first sample
        let first_result = results[0];
        console.log(first_result);

        let sample_values = first_result.sample_values;
        let otu_ids= first_result.otu_ids;
        let otu_labels = first_result.otu_labels;
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);
        
        //create trace for our bubble graph
        let trace2 = {
        x: otu_ids.reverse(),
        y: sample_values.reverse(),
        text: otu_labels.reverse(),
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids,
        }
       };
       let layout = {
        title : "Bacteria Count for each Sample ID",
        xaxis: {title: 'OTU ID'},
        yaxis: {title: 'Number of Bacteria'}
       };
       Plotly.newPlot("bubble", [trace2], layout)
    });
};

//create the demographic info function to populate each sample info
function Demographics (sample){
    d3.json(url).then((data) => {
    let demographic_info = data.metadata;

    let results = demographic_info.filter(id => id.id == sample);
    
    //storing first result to display in demographic info
    let first_result = results[0];
    console.log(first_result);
    d3.select('#sample-metadata').text('');
    //add the values to results
    Object.entries(first_result).forEach(([key, value]) => {
        console.log(key, value);

        d3.select('#sample-metadata').append('h4').text(`${key}, ${value}`);
        
    });

    });
};
//input values to create the graphs
function optionChanged(value){
    console.log(value);
    barChart(value);
    bubbleGraph(value);
    Demographics(value);
};

init();