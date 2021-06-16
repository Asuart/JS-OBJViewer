var ctx;
var $canvas = $("canvas");
var windowWidth = $canvas.width();
var windowHeight = $canvas.height();
var pixelsPerUnit = 300;


var mainCamera = new Camera();
var mainModel = new Model();
var perspective = true;
var displayModeFill = true;
var fov = 30.0;
var mMVP;


//get canvas and context
if ($canvas[0].getContext) {
    ctx = $canvas[0].getContext('2d');
}

function UpdateCanvasSize() {
    windowWidth = $canvas.width();
    windowHeight = $canvas.height();
    $canvas.attr("width", windowWidth);
    $canvas.attr("height", windowHeight);
}

$(window).resize(function() { UpdateCanvasSize(); });
$(document).ready(function() { UpdateCanvasSize(); });

function ToScreenCoords(vec) {
    return new vec3(pixelsPerUnit * vec.x + windowWidth / 2.0, windowHeight / 2.0 - pixelsPerUnit * vec.y, vec.z * pixelsPerUnit + windowHeight / 2.0);
}

function SetupMatrices() {
    let mModel = mainModel.GetModelMatrix();
    let mView = mainCamera.GetViewMatrix();
    let mProjection = CreateProjectionMatrix(fov, 1, 0.1, 1000.0);

    mMVP = CreateOneMatrix();
    mMVP = MultMatrix(mModel, mMVP);
    mMVP = MultMatrix(mView, mMVP);
    if (perspective) mMVP = MultMatrix(mProjection, mMVP);
}


function Draw(model) {
    SetupMatrices();
    let modelCopy = model.Clone();
    modelCopy.ApplyMatrix(mMVP);
    modelCopy.SortTriangles();
    for (var index = 0; index < modelCopy.triangles.length; index++) {
        ctx.beginPath();

        let v1 = ToScreenCoords(modelCopy.triangles[index].v0);
        let v2 = ToScreenCoords(modelCopy.triangles[index].v1);
        let v3 = ToScreenCoords(modelCopy.triangles[index].v2);

        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(v3.x, v3.y);
        ctx.lineTo(v1.x, v1.y);

        if (displayModeFill) {
            let dot = Math.abs(DotProduct(modelCopy.triangles[index].normal(), new vec3(0, 0, 1)));
            ctx.fillStyle = `rgb(${255 * dot}, ${255 * dot}, 0)`;
            ctx.fill();
        } else {
            ctx.strokeStyle = "#000";
            ctx.stroke();
        }

        ctx.closePath();
    }
}

function Redraw() {
    mainCamera.Rotate(0.03, 0);
    ctx.clearRect(0, 0, windowWidth, windowHeight);
    Draw(mainModel);
}

function ToggleDrawMode() {
    displayModeFill = !displayModeFill;
}

function ToggleProjection() {
    perspective = !perspective;
}

function SubdivideTriangles() {
    mainModel.SubdivideTriangles();
}

// on file load, read it, update model and drow it
document.getElementById('inputfile').addEventListener('change', function() {
    var fr = new FileReader();
    fr.onload = function() {
        mainModel = new Model(fr.result)
    }
    fr.readAsText(this.files[0]);
});

setInterval(Redraw, 50);


var mousePosX, mousePosY;
var clickStartX, clickStartY;

function OnMouseDown(event) {

}

function OnMouseMove(event) {

}

function OnMouseUp(event) {

}