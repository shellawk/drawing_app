function AutodrawTool(){
    this.name = "Autodraw";
    this.icon = "assets/autodraw.png";

    this.draw = function () {
        // console.log("in autodraw tool");
        if (!mouseOnCanvas(canvas)) {
            return;
        }
    }
}

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
var x;
var offsetX;
var offsetY;
var emptyArray2 = []; //y
var emptyArray = []; //x
var emptyArray3 = []; //times
var link;

window.onload = () => {
    x = document.body;
    offsetX = x.offsetLeft;
    offsetY = x.offsetTop;


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

    // link = document.getElementById('link');
    // link.setAttribute('download', 'MintyPaper.png');
    // link.setAttribute('href', canvas3.toDataURL("image/png").replace("image/png", "image/octet-stream"));

    document.getElementById("clearButton").addEventListener(
        "click", function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            inkArray.length = 0;
            sgs.innerHTML = "";
        });
    document.getElementById("resetButton").addEventListener(
        "click", function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx2.clearRect(0, 0, canvas.width, canvas.height);
            ctx3.clearRect(0, 0, canvas.width, canvas.height);
            sgsComplete=1;
            ctx.beginPath();
            inkArray.length = 0;
            sgs.innerHTML = "";

        });
    // document.getElementById("saveImageButton").addEventListener("click", function () {
    // 	saveImage
    // });
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
var clientX = 0;
var clientY = 0;
var putPoint = function (e) {
    if (dragging) {
        clientX = e.clientX;
        clientY = e.clientY;

        clientX -= canvas.height / 5.6;
        clientY -= canvas.height / 11.4;

        ctx.lineTo(clientX, clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(clientX, clientY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(clientX, clientY);
        canvas.style.cursor = "none";


        var mouseX = parseInt(clientX - offsetX);
        var mouseY = parseInt(clientY - offsetY);
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

function saveImage() {
    document.getElementById('header').setAttribute('style', 'display: none');
    document.getElementById('colour').setAttribute('style', 'display: none');
    document.getElementById('options').setAttribute('style', 'display: none');
    document.getElementById('sidebar').setAttribute('style', 'display: none');

    print();

    document.getElementById('header').setAttribute('style', 'display: block');
    document.getElementById('colour').setAttribute('style', 'display: flex');
    document.getElementById('options').setAttribute('style', 'display: block');
    document.getElementById('sidebar').setAttribute('style', 'display: block');
}