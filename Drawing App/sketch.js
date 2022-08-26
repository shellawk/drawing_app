//global variables that will store the toolbox colour palette
//amnd the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;
var canvas = null;
var canvas2 = null;
var canvas3 = null;
var dragging = false;
var startTime = 0;
var sgs = null;
var inkArray = [];
var ctx;
var ctx2;
var ctx3;
var radius;
var srcG;
var xAv, yAv, h, w;
var sgsComplete = 1;
var tempStroke = [];
var x = document.body;
var offsetX = x.offsetLeft;
var offsetY = x.offsetTop;
var emptyArray2 = []; //y
var emptyArray = []; //x
var emptyArray3 = []; //times
var link;

function setup() {

	// //create a canvas to fill the content div from index.html
	canvasContainer = select('#content');
	var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
	// // c.setAttribute('id', 'canvas2');
	c.parent("content");
    // canvas = c;
    
	//create helper functions and the colour palette
	helpers = new HelperFunctions();
	colourP = new ColourPalette();

	//create a toolbox for storing the tools
	toolbox = new Toolbox();

	//add the tools to the toolbox.
	toolbox.addTool(new FreehandTool());
	toolbox.addTool(new LineToTool());
	toolbox.addTool(new sprayCanTool);
	toolbox.addTool(new mirrorDrawTool());
    toolbox.addTool(new RectTool());
    toolbox.addTool(new EllipseTool());
    toolbox.addTool(new ScissorTool());
    
	background(255);

}

function draw() {
	//call the draw function from the selected tool.
	//hasOwnProperty is a javascript function that tests
	//if an object contains a particular method or property
	//if there isn't a draw method the app will alert the user
	if (toolbox.selectedTool.hasOwnProperty("draw")) {
		toolbox.selectedTool.draw();
	} else {
		alert("it doesn't look like your tool has a draw method!");
	}
}

function mousePressed(){
    //call mousePressed from the selected tool if 
    //the selected tool has a mousePressed() method
    if (toolbox.selectedTool.hasOwnProperty("mousePressed")) {
		toolbox.selectedTool.mousePressed();
	}
}
function mouseDragged(){
 //call mouseDragged from the selected tool if
 //the selected tool has a mouseDragged() method
    if (toolbox.selectedTool.hasOwnProperty("mouseDragged")) {
        toolbox.selectedTool.mouseDragged();
    }
 }

window.onload = () => {
	sgs = document.getElementById('suggestions');

	canvas = document.getElementById('defaultCanvas0');
	canvas.addEventListener("mousemove", putPoint);
	canvas.addEventListener("mousedown", engage);
	canvas.addEventListener("mouseup", disengage);
	canvas.addEventListener("mouseout", disengage);

	contentDiv = document.getElementById('content');
	canvasWidth = contentDiv.offsetWidth;
	canvasHeight = contentDiv.offsetHeight;

	ctx = canvas.getContext("2d");
	canvas2 = document.getElementById('canvas2');
	canvas3 = document.getElementById('canvas3');
	
	canvas2.setAttribute('width', canvas.width);
	canvas2.setAttribute('height', canvas.height);
	canvas2.setAttribute('style', 'width: ' + canvas.width + 'px; height: ' + canvas.height + 'px;')
	canvas3.setAttribute('width', canvas.width);
	canvas3.setAttribute('height', canvas.height);
	canvas3.setAttribute('style', 'width: ' + canvas.width + 'px; height: ' + canvas.height + 'px;')

	ctx2 = canvas2.getContext("2d");
	ctx3 = canvas3.getContext("2d");

	radius = 3;	
	ctx.lineWidth = radius * 2;

	link = document.getElementById('link');
	link.setAttribute('download', 'MintyPaper.png');
	link.setAttribute('href', canvas3.toDataURL("image/png").replace("image/png", "image/octet-stream"));

	document.getElementById("clearButton").addEventListener(
		"click", function () {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			inkArray.length = 0;
			sgs.innerHTML = "";
		});
	document.getElementById("saveImageButton").addEventListener(
		"click", function () {
			html2canvas(document.getElementById('canvas3'), {
			allowTaint: true,
			useCORS: true}).then(function (canvas)
				{
					link.setAttribute('download', 'MintyPaper.png');
					link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
					link.click();
				}).catch(function (error) {console.log(error);});
		});
}

class Ink {
	constructor(xcoords, ycoords, times) {
		this.xcoords = xcoords;
		this.ycoords = ycoords;
		this.times = times;
	}
}

function displaySuggestions(arr) {
	var appnd = '';
	sgs.innerHTML = '';

	arr.forEach(function (a) {
		if (a in window.stencils) {
			window.stencils[a].forEach(function (b) {
				sgs.innerHTML += '<img class="img" src="' + b.src + '" s-name=""/>';
			});
		}
	});

	document.getElementById('suggestions').addEventListener('click', btn);


}

// DRAW METHOD + COORDINATES
var putPoint = function (e) {
	if (dragging) {
		ctx.lineTo(e.clientX, e.clientY);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(e.clientX, e.clientY, radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
		canvas.style.cursor = "none";


		var mouseX = parseInt(e.clientX - offsetX);
		var mouseY = parseInt(e.clientY - offsetY);
		var time = Date.now() - startTime;
		emptyArray3.push(time);
		emptyArray.push(mouseX);
		emptyArray2.push(mouseY);
	}
};

var srcG;
var xAv, yAv, h, w;
var sgsComplete = 1;

var btn = function (e) {
	try {
		sgsComplete = 0;
		var xMax = canvas.width;
		var yMax = canvas.height;

		var img = new Image();
		srcG = e.target.src.toString();
		img.src = srcG;

		xAv = (Math.max.apply(null, inkArray[0].xcoords) + Math.min.apply(null, inkArray[0].xcoords)) / 2;
		yAv = (Math.max.apply(null, inkArray[0].ycoords) + Math.min.apply(null, inkArray[0].ycoords)) / 2;

		w = 200;
		h = 200;

		//console.log(xAv);
		//console.log('y avg:'+Math.min.apply(null, inkArray[0].ycoords)+', max canvas');

		//clearFunction();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx2.clearRect(0, 0, canvas.width, canvas.height);
		img.onload = function () {
			ctx2.drawImage(img, (xAv - w / 2), (yAv - h / 2), w, h);
			//inkArray.length = 0;
			//ctx.clearRect(x, y, w, h);
		};
		// no chance to choose again after first choice from the suggestions
		sgs.innerHTML = "";
	}
	catch (err) {
		console.warn('Null click has been handled.');
		console.log(err);
	}
}


var engage = function (e) {
	dragging = true;
	emptyArray = [];     // ready for a new stroke
	emptyArray2 = [];    // ready for a new stroke
	emptyArray3 = [];   // ready for a new stroke
	startTime = Date.now();
	ctx.fillStyle = "black";

	if (!sgsComplete) {
		var img = new Image();
		// console.log(srcG);
		img.src = srcG;

		ctx2.clearRect(0, 0, canvas.width, canvas.height);
		img.onload = function () {
			// console.log(ctx3);
			// console.log(img + ' ' + (xAv - w / 2) + ' ' + (yAv - h / 2) + ' ' + w + ' ' + h);
			ctx3.drawImage(img, (xAv - w / 2), (yAv - h / 2), w, h);
			inkArray.length = 0;
		};
		// no chance to choose again after first choice from the suggestions
		sgs.innerHTML = "";
		sgsComplete = 0;
	}
	putPoint(e); // one click = a point
};

var disengage = function () {
	if (dragging === true) {
		dragging = false;
		ctx.beginPath();   //to leave where we left
		canvas.style.cursor = "pointer";

		var stroke = new Ink(emptyArray, emptyArray2, emptyArray3); //ink object created with x and y

		inkArray.push(stroke); // put the completed stroke into array
		//console.log("stroke'un 0. x coordu: " + stroke.xcoords[0]);
		var postArray = inkArray.map(function (inkObj) {
			return [inkObj.xcoords, inkObj.ycoords, inkObj.times];
		});

		var url = 'https://inputtools.google.com/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8';
		var requestBody = {
			input_type: 0,
			requests: [{
				ink: postArray,
				language: 'autodraw',
				writing_guide: {
					height: 400,
					width: 700
				}
			}]
		};
		fetch(url, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json; charset=utf-8'
			}),
			body: JSON.stringify(requestBody),
		}).then(function (response) {
			return response.json();
		}).then(function (jsonResponse) {

			//console.log(jsonResponse[1][0][1]);
			displaySuggestions(jsonResponse[1][0][1]);
		});
	}
};
