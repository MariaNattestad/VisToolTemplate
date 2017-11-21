var VTTGlobal = {
	inputSpec: undefined, 
	currentPage: "#first",
	loadedData: {},
	layout: {},
};

// System for navigation bar links
function changePage(page) {
	d3.selectAll(".page").style("display","none");
	d3.selectAll(".page_tab").classed("active", false);

	VTTGlobal.currentPage = page;
	d3.select(VTTGlobal.currentPage).style("display", "block");
	d3.select(VTTGlobal.currentPage+"_tab").classed("active", true);
}


// System for communicating messages to the user
function showMessage(message, sentiment) {
	
	if (message !== undefined) {
		var look = R.contains(sentiment, ["success","warning","danger","info"]) ? sentiment : "info";

		var alert = d3.select("#messagesContainer")
			.append("div")
				.attr("class","alert alert-" + look +" alert-dismissable")
				.attr("role","alert");
		alert.append("a")
			.attr("href","#")
			.attr("class","close")
			.attr("data-dismiss","alert")
			.attr("aria-label","close")
			.html("&times;");
		alert.append("p")
			.html(message);
	} else {
		// use empty message as a sign to clear all alerts
		d3.select("#messagesContainer").html("");
	}
}


function setExamples(examples) {
	var baseURL = location.protocol + '//' + location.host + location.pathname;


	d3.select("#examples").selectAll("a").data(examples).enter().append("a")
	.attr("href", function(d) {return baseURL + d.urlSuffix})
	.html(function(d) {return d.name})
	.property("title", function(d) {return d.hover});


}



// Set up a system for reading and parsing data
function readTSVorCSV(source, inputType, variable) {
	if (inputType === "url") {
		Papa.parse(source, {
			download: true,
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true,
			complete: function(parsed) {
				setInputData(parsed.data, variable);
			},
			before: function() {
				console.log("Loading file from URL");
			},
			error: function(err) {
				showMessage("Failed to load file from URL. Make sure this URL is correct and publicly accessible, and check the console for specific errors.", "danger");
			}
		});
	} else if (inputType === "File") {
		if (source.size > 10000000) {
			showMessage("Loading large file may take a while.", "warning");
		}
		Papa.parse(source, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true,
			complete: function(parsed) {
				setInputData(parsed.data, variable);
			}
		});
	}
}

// Create input fields based on the inputSpec
function setInputSpec(inputSpec) {
	// Set up the input panel to automatically create a UI for the user to load those inputs
	VTTGlobal.inputSpec = inputSpec;

	var _input_panel = new InputPanel({
		element: d3.select("#inputPanel"),
		spec: inputSpec,
	});

}

function setInputData(data, variable) {
	
	// If you need input validation to make sure the data has the right format, do it here before setting VTTGlobal.loadedData
	// You can also apply any transformations to the data before setting VTTGlobal.loadedData

	VTTGlobal.loadedData[variable] = data;


	// You can set some rules here to launch the visualization as soon as the required inputs are available
	// If you have optional inputs, you can instead call launchVisualization() in the onclick event of a button that the user clicks when they are satisfied with all their inputs

	var allRequiredVariablesLoaded = true;
	for (var key in VTTGlobal.inputSpec) {
		if (VTTGlobal.inputSpec[key].required && VTTGlobal.loadedData[key] === undefined) {
			allRequiredVariablesLoaded = false;
		}
	}
	if (allRequiredVariablesLoaded) {
		launchVisualization();
	}
}


// Measure the width and height of the screen
var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0];


VTTGlobal.layout = {
	svg: {
		width: (w.innerWidth || e.clientWidth || g.clientWidth)*0.90,
		height: (w.innerHeight || e.clientHeight || g.clientHeight)*0.80
	},
	margin: {
		top: 100,
		left: 80,
		right: 100,
		bottom: 80
	}
};

VTTGlobal.layout.inner = {
	width: VTTGlobal.layout.svg.width - VTTGlobal.layout.margin.left - VTTGlobal.layout.margin.right,
	height: VTTGlobal.layout.svg.height - VTTGlobal.layout.margin.top - VTTGlobal.layout.margin.bottom
};



function launchVisualization() {
	changePage("#main");
	d3.select("#main_tab").style("display", "block");


	main(VTTGlobal.loadedData); // inside app.js <-- fill out the main() function inside app.js to edit the visualization itself

}
