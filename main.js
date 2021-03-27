
// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 400;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 900;

// GRAPH 1 
// create svg 
let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)     // HINT: width
    .attr("height", graph_1_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(200 , ${margin.top})`); 
    let countRef = svg.append("g");

let tooltip = d3.select("#graph1").append("div").attr("class", "tooltip");;
// select the data 
d3.csv("data/video_games.csv").then(function(data) {
    // sort and clean the data 
    data.sort(function(b, a) {
        return a.Global_Sales - b.Global_Sales;
      });
    data = data.slice(0,10)


// set up Y axis 
let y = d3.scaleBand()
.domain(data.map(function(d) { return d.Name }))
.range([0, graph_1_height - margin.top - margin.bottom])
.padding(0.1); 
svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

// Add X axis
let x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.Global_Sales; })])
        .range([0, graph_1_width - margin.left - margin.right]);

        let color = d3.scaleOrdinal()
        .domain(data.map(function(d) {return d.Name}))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 10)) 
        
        
        let mouseover = function(d) {
          let html = `Global Sales: ${d.Global_Sales}`;
          tooltip.html(html)
              .style("left", `${(d3.event.pageX) - 100}px`)
              .style("top", `${(d3.event.pageY) -80}px`)
              .transition()
              .duration(200)
              .style("opacity", 1);
        };
        
        let mouseout = function(d) {
          tooltip.transition()
              .duration(200)
              .style("opacity", 0);
        };

  // Bars
  let bars = svg.selectAll("rect").data(data);
  bars.enter()
        .append("rect")
        .merge(bars)  
        .attr("fill", function(d) { return color(d.Name) }) 
        .attr("x", x(0))
        .attr("y", function(d) {return y(d.Name)})          
        .attr("height", y.bandwidth() )
        .attr("width",  function(d) {return x(d.Global_Sales); })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);    


});

// Add y-axis label
svg.append("text")
.attr("transform", `translate(-160, ${(graph_1_height - margin.top - margin.bottom) / 2})rotate(-90)`)      
.style("text-anchor", "middle")
.text("Name");

svg.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2 },
                                        ${(graph_1_height - margin.top - margin.bottom) + 15})`)       // HINT: Place this at the bottom middle edge of the graph
        .style("text-anchor", "middle")
        .text("Global Sales");

svg.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-10})`)       // HINT: Place this at the top middle edge of the graph
        .style("text-anchor", "middle")
        .text("Top 10 Video Games of All Time")
        .style("font", "bold 15px Helvetica");


 //Graph 2 
 // create svg 
let svg2 = d3.select("#graph2")
.append("svg")
.attr("width", graph_2_width)     // HINT: width
.attr("height", graph_2_height)     // HINT: height
.append("g")
.attr("transform", `translate(320 , 200)`); 
let countRef3 = svg2.append("g");


var color = d3.scaleOrdinal()
  .domain(12)
  .range(["#ecdb54","#e34132","#6ca0dc","#944743","#dbb2d1","#ec9787","#00a68c","#645394","#6c4f3d","#ebe1df","#bc6ca7", "#bfd833"]);

var radius = Math.min(300) / 2 - 20;

function update1(region) {
d3.csv("data/video_games.csv").then(function(data) {
var data = d3.nest()
.key(function(d) { return d.Genre; })
.rollup(function(v) { return d3.sum(v, function(d) { return d[region]; }); })
.entries(data)
  var pie = d3.pie()
    .value(function(d) {return d.value.value;})

var data_ready = pie(d3.entries(data))
var u = svg2.selectAll("path")
  .data(data_ready)

  const legend = svg2
  .append('g')
  .attr('transform', `translate(160,-125)`);

legend
    .selectAll(null)
    .data(data_ready)
    .enter()
    .append('rect')
    .attr('y', d => 12 * d.data.key * 1.8)
    .attr('width', 12)
    .attr('height', 12)
    .attr('fill', d => color(d.data.key))
    .attr('stroke', 'grey')
    .style('stroke-width', '1px');

    legend
    .selectAll(null)
    .data(data_ready)
    .enter()
    .append('text')
    .text(d => d.data.value.key)
    .attr('x', 12 * 1.2)
    .attr('y', d => 12 * d.data.key * 1.8 + 12)
    .style('font-family', 'sans-serif')
    .style('font-size', `12px`);
   
u
    .enter()
    .append('path')
    .merge(u)
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)
  
    u
    .exit()
    .remove()
});

}
let JP_Sales = "JP_Sales"
let NA_Sales = "NA_Sales"
let EU_Sales = "EU_Sales"
update1("JP_Sales");

svg2.append("text")
        .attr("transform", `translate(0, -150)`)       // HINT: Place this at the top middle edge of the graph
        .style("text-anchor", "middle")
        .text("Genre Popularity Per Region")
        .style("font", "bold 15px Helvetica");


                // GRAPH 3
let svg3 = d3.select("#graph3")
.append("svg")
.attr("width", graph_3_width )     // HINT: width
.attr("height", graph_3_height)     // HINT: height
.append("g")
.attr("transform", `translate(60 , 40)`); 
let countRef2 = svg3.append("g")

  var x = d3.scaleBand()
  .range([ 0, 525 ])
  .padding(0.1)

  var x_axis = svg3.append("g")
  .attr("transform", "translate(0,600)")

  var y = d3.scaleLinear()
  .range([600, 0]);

  var y_axis = svg3.append("g")
  .attr("class", "myYaxis")


  function update(i) {
    d3.csv("data/video_games.csv").then(function(data) {
    data = d3.nest()
    .key(function(d) { return d.Genre; })
    .key(function(d) { return d.Publisher; })
    .rollup(function(v) { return v.length })
    .entries(data)
    data = data[i]
    var values1 = data.values
    values1 = values1.sort(function(b, a) {
      return a.value - b.value;
    });
    values1 = values1.slice(0,10)
    // X axis
  
    x.domain(values1.map(function(d) { return d.key; }))
    x_axis
  .call(d3.axisBottom(x))
  .selectAll("text")
.attr("transform", "translate(-10,0)rotate(-45)")
.style("text-anchor", "end");
  

  // Add Y axis

y.domain([0, d3.max(values1, function(d) { return d.value + 10;} )])
y_axis.call(d3.axisLeft(y));

var u = svg3.selectAll("rect")
    .data(values1)
    
  u
    .enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(1000)
      .attr("x", function(d) { return x(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return 600- y(d.value); })
      .attr("fill", "#69b3a2")   

      u
    .exit()
    .remove();

     });
    
  }
  update(0);

  svg3.append("text")
  .attr("transform", `translate(270, 0)`)       // HINT: Place this at the top middle edge of the graph
  .style("text-anchor", "middle")
  .text("Top Publishers per Genre")
  .style("font", "bold 15px Helvetica");

  // Add y-axis label
svg3.append("text")
.attr("transform", `translate(-48, 280)rotate(-90)`)      
.style("text-anchor", "middle")
.text("Games Published");

svg3.append("text")
        .attr("transform", `translate(225,750)`)       // HINT: Place this at the bottom middle edge of the graph
        .style("text-anchor", "middle")
        .text("Top 10 Publishers");
        

