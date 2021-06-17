var ctx;
var $canvas = $("canvas");
var windowWidth = $canvas.width();
var windowHeight = $canvas.height();
var pixelsPerUnit = 300;

var preloadedModels = {
    octahedron: "v 0.000000 1.000000 0.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 0.000000 1.000000\nv 0.000000 1.000000 0.000000\nv 0.000000 0.000000 1.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv 0.000000 0.000000 1.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 0.000000 1.000000\nv 0.000000 1.000000 0.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 0.000000 -1.000000\nv 0.000000 1.000000 0.000000\nv 0.000000 0.000000 -1.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv 0.000000 0.000000 -1.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 0.000000 -1.000000\nf 1 2 3\nf 4 5 6\nf 7 8 9\nf 10 11 12\nf 13 14 15\nf 16 17 18\nf 19 20 21\nf 22 23 24",
    cube: "v 1.000000 -1.000000 -1.000000\nv 1.000000 -1.000000 1.000000\nv -1.000000 -1.000000 1.000000\nv -1.000000 -1.000000 -1.000000\nv 1.000000 1.000000 -0.999999\nv 0.999999 1.000000 1.000001\nv -1.000000 1.000000 1.000000\nv -1.000000 1.000000 -1.000000\nf 2 3 4\nf 8 7 6\nf 5 6 2\nf 6 7 3\nf 3 7 8\nf 1 4 8\nf 1 2 4\nf 5 8 6\nf 1 5 2\nf 2 6 3\nf 4 3 8\nf 5 1 8\n"
}

var mainCamera = new Camera();
var mainModel = new Model(preloadedModels["octahedron"]);
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

// on file load, read it, update model and draw it
document.getElementById('inputfile').addEventListener('change', function() {
    var fr = new FileReader();
    fr.onload = function() {
        mainModel = new Model(fr.result)
    }
    fr.readAsText(this.files[0]);
});

setInterval(Redraw, 50);



$(".dropdown-option").click(function() {
    if ($(this).hasClass("load-file")) return;
    mainModel = new Model(preloadedModels[$(this).data("src")]);
    $(this).closest(".dropdown").find(".dropdown-value").text($(this).data("src") + ".obj");
});

var mousePosX, mousePosY;
var clickStartX, clickStartY;

function OnMouseDown(event) {

}

function OnMouseMove(event) {

}

function OnMouseUp(event) {

}