function main(loadedData) {
	var layout = VTTGlobal.layout;

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////// This is where you can do all your visualization magic with the data you just loaded /////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// Set up the SVG itself
	var svg = d3.select('svg#vis')
		.attr("width", layout.svg.width)
		.attr("height", layout.svg.height)

	////////////   Example static visualizations   ////////////
	// Background:
	svg.append("rect")
		.attr("width",layout.svg.width)
		.attr("height",layout.svg.height)
		.attr("fill","#fff4d6");


	var width = layout.inner.width;
	var height = layout.inner.height;

	var inner = svg.append("g")
		.attr("class","inner")
		.attr("transform", "translate(" + layout.margin.left + ", " + layout.margin.top + ")");
	

	// Look at the contents of the data in the console (for development)
	console.log(loadedData);



	


	// Here is an example visualization

	var chromosomeData = loadedData.input;


	// Abstract out the specific column names to make them easier to modify
	var xVariable = "Base pairs";
	var yVariable = "Length (mm)";
	var sizeVariable = "Protein-coding genes";
	var textVariable = "Chromosome";


	// Set up some scales to manage placement and sizing of data points
	var xScale = d3.scaleLinear()
		.domain(d3.extent(chromosomeData, function(d) {return d[xVariable]}))
		.range([0, width]);

	var yScale = d3.scaleLinear()
		.domain(d3.extent(chromosomeData, function(d) {return d[yVariable]}))
		.range([height, 0]); // y scale 0 is at the top edge of the SVG, so small values should be at the bottom (height), high values at the top (0)

	var sizeScale = d3.scaleLinear()
		.domain(d3.extent(chromosomeData, function(d) {return d[sizeVariable]}))
		.range([5, 25]); // size range: [minimum, maximum]

	// Draw axes
	inner.append("g")
		.attr("class", "yAxis")
		.call(d3.axisLeft(yScale));


	inner.append("g")
		.attr("class", "xAxis")
		.attr("transform", "translate(0, " + height + ")")
		.call(d3.axisBottom(xScale));

	// Axis titles
	inner.append("text")
		.text(xVariable)
		.attr("x", width/2)
		.attr("y", height + layout.margin.bottom/2)
		.style('text-anchor',"middle")
		.attr("dominant-baseline","middle");

	inner.append("text")
		.text(yVariable)
		.attr("transform", "translate(" + (layout.margin.left * -0.5) + ", " + height / 2 + ") rotate(-90)")
		.style('text-anchor',"middle")
		.attr("dominant-baseline","middle");



	// Draw data points

	var points = inner.selectAll("g.point").data(chromosomeData);

	var newPoints = points.enter().append("g")
		.attr("class","point");

	newPoints.append("circle");
	newPoints.append("text");


	points.exit().remove();

	// Position each data point
	points = points.merge(newPoints)
		.attr("transform", function(d) {return "translate(" + xScale(d[xVariable]) + ", " + yScale(d[yVariable]) + ")"});
		
	// Draw text for each data point
	points.select("text")
		.style("font-size", function(d) {return sizeScale(d[sizeVariable])})
		.text(function(d) {return d[textVariable]})
		.style('text-anchor',"middle")
		.attr("dominant-baseline","middle")
		.attr("fill", "white");

	// Draw a circle for each data point
	points.select("circle")
		.attr("r", function(d) {return sizeScale(d[sizeVariable])})
		.attr("fill", "#610070")




}