function buildMetadata(sample) {
  let metadataUrl = `/metadata/${sample}`;

  d3.json(metadataUrl).then(function(sample) {
    metaChart = d3.select("#sample-metadata");
    let metaData = sample;

    metaChart.selectAll("ul").remove();
    let ul = metaChart.append("ul");

    Object.entries(metaData).forEach(([key, value]) => {
      var cell = ul.append("li");
      cell.text(`${key}: ${value}`);
    });

    // Guage Chart

    let gaugeChart = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: sample.WFREQ,
        title: { text: "Belly Button Washes per Week" },
        type: "indicator",
        mode: "gauge+number",
        autosize: true,
        gauge: {
          axis: { range: [0, 10] },
          steps: [
            { range: [0, 2], color: "#fff2cc" },
            { range: [2, 4], color: "#ffdf80" },
            { range: [4, 6], color: "#ffcc33" },
            { range: [6, 8], color: "#e6ac00" },
            { range: [8, 10], color: "#997300" }
          ],
          bar: { color: "#88cc00" }
        }
      }
    ];

    let gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot("gauge", gaugeChart, gaugeLayout);
  });
}

function buildCharts(sample) {
  chartUrl = `/samples/${sample}`;
  d3.json(chartUrl).then(function(response) {
    let sampleData = response;

    // Pie Chart

    let samples10 = sampleData.sample_values.slice(0, 10);
    let ids10 = sampleData.otu_ids.slice(0, 10);
    let labels10 = sampleData.otu_labels.slice(0, 10);

    var pieChart = [
      {
        values: samples10,
        labels: ids10,
        type: "pie"
      }
    ];

    var pieLayout = {
      autosize: true,
      hoverinfo: labels10,
      textinfo: "none"
    };

    Plotly.newPlot("pie", pieChart, pieLayout);

    // Bubble Chart

    let bubbleChart = [
      {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        mode: "markers",
        marker: {
          color: sampleData.otu_ids,
          size: sampleData.sample_values,
          showscale: true
        }
      }
    ];

    let bubbleLayout = {
      showlegend: false,
      autosize: true,
      margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 50,
        pad: 5
      }
    };

    Plotly.newPlot("bubble", bubbleChart, bubbleLayout);
  });
}

function init() {
  var selector = d3.select("#selDataset");
  d3.json("/names").then(sampleNames => {
    sampleNames.forEach(sample => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();

// metaChart.text(
//   `${age}\n${type}\n${ethnicity}\n${gender}\n${location}\n${wfreq}\n${sample_n}`
// );
