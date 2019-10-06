var width = 800,
    height = 800,
    radius = Math.min(width, height) / 2,
    innerRadius = 0.3 * radius;

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.width; });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>" +
           "<br> Market Region" + ": <span style='color:lightblue'>" + d.data.region + "</span>" +
           "<br> Climate Type" + ": <span style='color:lightgreen'>" + d.data.climate_type + "</span>";
           "<br> Land Area" + ": <span style='color:grey'>" + d.data.area + "</span>" +
           "<br> GFA" + ": <span style='color:yellow'>" + d.data.GFA + " " + "sqm </span>" +
           "<br> FAR" + ": <span style='color:pink'>" + d.data.FAR + "</span>";
  });

var arc = d3.svg.arc()
  .innerRadius(innerRadius)
  .outerRadius(function (d) {
    return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius;
  });

var outlineArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.call(tip);

d3.csv("https://raw.githubusercontent.com/wenhaowuuu/60daychallenge/master/data_leed_piechart.csv", function(error, data) {

  data.forEach(function(d) {
    d.id     =  d.id;
    d.region  = d.region;
    d.color  =  d.color;
    d.weight = +d.weight;
    d.score  = +d.score;
    d.width  = +d.weight;
    // d.region  = +d.region;
    d.label  =  d.label;
  });
  // for (var i = 0; i < data.score; i++) { console.log(data[i].id) }

  var path = svg.selectAll(".solidArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", function(d) { return d.data.color; })
      .attr("class", "solidArc")
      .attr("stroke", "gray")
      .attr("d", arc)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  var outerPath = svg.selectAll(".outlineArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("class", "outlineArc")
      .attr("d", outlineArc);

//trying the enabling clicking-rotating activity

      // arc.append("path")
      //     .attr("d", path)
      //     .attr("fill", function(d) { return d.data.color; })
      //     .on("click",function(d) {
      //       // The amount we need to rotate:
      //       var rotate = 180-(d.startAngle + d.endAngle)/2 / Math.PI * 180;
      //
      //       // Transition the pie chart
      //       g.transition()
      //         .attr("transform",  "translate(" + width / 2 + "," + height / 2 + ") rotate(" + rotate + ")")
      //         .duration(1000);
      //
      //      // Τransition the labels:
      //      text.transition()
      //        .attr("transform", function(dd) {
      //          return "translate(" + label.centroid(dd) + ") rotate(" + (-rotate) + ")"; })
      //        .duration(1000);
      //
      //     });




  // calculate the weighted mean score
  var score =
    data.reduce(function(a, b) {
      //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
      return a + (b.score * b.weight);
    }, 0) /
    data.reduce(function(a, b) {
      return a + b.weight;
    }, 0);

  svg.append("svg:text")
    .attr("class", "aster-score")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle") // text-align: right
    .text("CDP");
    // .text(Math.round(score));

    var legend = g.append("g")
      .selectAll("g")
      .data(data.columns.slice(1).reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(-40," + (i - (data.columns.length - 1) / 2) * 20 + ")"; });

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", z);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .text(function(d) { return d; });

});
