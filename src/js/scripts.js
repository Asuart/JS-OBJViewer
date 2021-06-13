
var $canvas = $("canvas");
var windowWidth = $canvas.width();
var windowHeight = $canvas.height();

function UpdateCanvasSize(){
    windowWidth = $canvas.width();
    windowHeight = $canvas.height();
    $canvas.attr("width", windowWidth);
    $canvas.attr("height", windowHeight);
}

$(window).resize(function(){
    UpdateCanvasSize();
});
$(document).ready(function(){
    UpdateCanvasSize();
});


class vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    distance(start) {
        return Math.sqrt((start.x - this.x) * (start.x - this.x) + (start.y - this.y) * (start.y - this.y) + (start.z - this.z) * (start.z - this.z));
    }
    normalize() {
        let l = this.length();
        this.x /= l;
        this.y /= l;
        this.z /= l;
    }
    copy() {
        return new vec3(this.x, this.y, this.z);
    }
    toScreenCoords() {
        return new vec3(300 * this.x + windowWidth / 2.0, windowHeight / 2.0 - 300 * this.y, -this.z * 300.0);
    }
}

class Triangle {
    constructor(v0, v1, v2) {
        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2;
    }
    center() {
        return new vec3((this.v0.x + this.v1.x + this.v2.x) / 3.0, (this.v0.y + this.v1.y + this.v2.y) / 3.0, (this.v0.z + this.v1.z + this.v2.z) / 3.0);
    }
    distance(start) {
        let c = this.center();
        return (Math.sqrt((start.x - c.x) * (start.x - c.x) + (start.y - c.y) * (start.y - c.y) + (start.z - c.z) * (start.z - c.z)));
    }
    normal() {
        let vec1 = new vec3(this.v1.x - this.v0.x, this.v1.y - this.v0.y, this.v1.z - this.v0.z);
        let vec2 = new vec3(this.v2.x - this.v0.x, this.v2.y - this.v0.y, this.v2.z - this.v0.z);
        let cross = new vec3(vec1.y * vec2.z - vec1.z * vec2.y, vec1.z * vec2.x - vec1.x * vec2.z, vec1.x * vec2.y - vec1.y * vec2.x);
        cross.normalize();
        return cross;
    }
    copy() {
        return new Triangle(this.v0.copy(), this.v1.copy(), this.v2.copy());
    }
}

class Model {
    constructor(source) {
        if (source == undefined) source = "v 0.000000 1.000000 0.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 0.000000 1.000000\nv 0.000000 1.000000 0.000000\nv 0.000000 0.000000 1.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv 0.000000 0.000000 1.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 0.000000 1.000000\nv 0.000000 1.000000 0.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 0.000000 -1.000000\nv 0.000000 1.000000 0.000000\nv 0.000000 0.000000 -1.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv 0.000000 0.000000 -1.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 0.000000 -1.000000\nf 1 2 3\nf 4 5 6\nf 7 8 9\nf 10 11 12\nf 13 14 15\nf 16 17 18\nf 19 20 21\nf 22 23 24"
        this.Load(source);
    }
    Load(source) {
        let vertices = new Array();
        let indexes = new Array();
        var vCount = 0;
        var fCount = 0;

        while (true) {
            var endIndex = source.indexOf("\n");
            let isLastLine = false;
            if (endIndex == -1) {
                endIndex = source.length;
                isLastLine = true;
            }
            if (source.charAt(0) == 'v' && source.charAt(1) == ' ') {
                var str = source.substr(2, endIndex - 1);
                var spaceIndex = str.indexOf(' ');
                var v1 = str.substr(0, spaceIndex);
                str = str.slice(spaceIndex + 1, str.length);
                spaceIndex = str.indexOf(' ');
                var v2 = str.substr(0, spaceIndex);
                str = str.slice(spaceIndex + 1, str.length);
                var v3 = str;

                vertices[vCount++] = new vec3(+(v1), +(v2), +(v3));
            } else if (source.charAt(0) == 'f' && source.charAt(1) == ' ') {
                var str = source.substr(2, endIndex - 1);
                var spaceIndex = str.indexOf(' ');
                var v1 = str.substr(0, spaceIndex);
                str = str.slice(spaceIndex + 1, str.length);
                spaceIndex = str.indexOf(' ');
                var v2 = str.substr(0, spaceIndex);
                str = str.slice(spaceIndex + 1, str.length);
                var v3 = str;


                var slashIndex = v1.indexOf("/");
                if(slashIndex != -1) v1 = v1.substr(0, slashIndex);
                slashIndex = v2.indexOf("/");
                if(slashIndex != -1) v2 = v2.substr(0, slashIndex);
                slashIndex = v3.indexOf("/");
                if(slashIndex != -1) v3 = v3.substr(0, slashIndex);

                indexes[fCount * 3] = (+(v1)) - 1;
                indexes[fCount * 3 + 1] = (+(v2)) - 1;
                indexes[fCount * 3 + 2] = (+(v3)) - 1;
                fCount++;
            }
            if (isLastLine) {
                break;
            } else {
                source = source.slice(endIndex + 1, source.length);
            }
        }

        // normalization of model to fit it into view
        let minX = 0.0,
            minY = 0.0,
            minZ = 0.0;
        for (let i = 0; i < vertices.length; i++) {
            if (vertices[i].x < minX) minX = vertices[i].x;
            if (vertices[i].y < minY) minY = vertices[i].y;
            if (vertices[i].z < minZ) minZ = vertices[i].z;
        }
        for (let i = 0; i < vertices.length; i++) {
            vertices[i].x -= minX;
            vertices[i].y -= minY;
            vertices[i].z -= minZ;
        }
        let max = 0
        for (let i = 0; i < vertices.length; i++) {
            if (vertices[i].x > max) max = vertices[i].x;
            if (vertices[i].y > max) max = vertices[i].y;
            if (vertices[i].z > max) max = vertices[i].z;
        }
        for (let i = 0; i < vertices.length; i++) {
            vertices[i].x /= max;
            vertices[i].y /= max;
            vertices[i].z /= max;
            vertices[i].x -= 0.5;
            vertices[i].y -= 0.5;
            vertices[i].z -= 0.5;
        }

        this.triangles = new Array();
        for (let i = 0; i < indexes.length / 3; i++)
            this.triangles.push(new Triangle(vertices[indexes[i * 3]], vertices[indexes[i * 3 + 1]], vertices[indexes[i * 3 + 2]]));
    }

    SortTriangles() {
        let swaps = 0;
        let distances = new Array();
        let start = new vec3(0, 0, -1);
        for (let i = 0; i < this.triangles.length; i++) {
            distances[i] = this.triangles[i].distance(start);
        }

        for (let i = distances.length; i > 1; i--) {
            for (let j = 0; j < i; j++) {
                if (distances[j] > distances[i]) {
                    let tempDistance = distances[i];
                    distances[i] = distances[j];
                    distances[j] = tempDistance;
                    let tempTriangle = this.triangles[i];
                    this.triangles[i] = this.triangles[j];
                    this.triangles[j] = tempTriangle;
                    swaps++;
                }
            }
        }

        //console.log("Sort: " + swaps + " swaps");
    }

    ApplyMatrix(mvp) {
        for (let i = 0; i < this.triangles.length; i++) {
            this.triangles[i].v0 = multPointMatrix(this.triangles[i].v0, mvp);
            this.triangles[i].v1 = multPointMatrix(this.triangles[i].v1, mvp);
            this.triangles[i].v2 = multPointMatrix(this.triangles[i].v2, mvp);
        }
    }

    Clone() {
        let newModel = new Model();
        for (let i = 0; i < this.triangles.length; i++) newModel.triangles[i] = this.triangles[i].copy();
        return newModel;
    }

    Draw(mvp) {
        let modelCopy = this.Clone();
        modelCopy.ApplyMatrix(mvp);
        modelCopy.SortTriangles();
        for (var index = 0; index < modelCopy.triangles.length; index++) {
            ctx.beginPath();

            let v1 = modelCopy.triangles[index].v0.toScreenCoords();
            let v2 = modelCopy.triangles[index].v1.toScreenCoords();
            let v3 = modelCopy.triangles[index].v2.toScreenCoords();

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
    SubdivideTriangles() {
        let newTriangles = new Array();

        for(let i = 0; i < this.triangles.length; i++){
            let v1 = this.triangles[i].v0.copy();
            let v2 = this.triangles[i].v1.copy();
            let v3 = this.triangles[i].v2.copy();
            let v12 = new vec3(v1.x + (v2.x - v1.x) / 2.0, v1.y + (v2.y - v1.y) / 2.0, v1.z + (v2.z - v1.z) / 2.0);
            let v13 = new vec3(v1.x + (v3.x - v1.x) / 2.0, v1.y + (v3.y - v1.y) / 2.0, v1.z + (v3.z - v1.z) / 2.0);
            let v23 = new vec3(v2.x + (v3.x - v2.x) / 2.0, v2.y + (v3.y - v2.y) / 2.0, v2.z + (v3.z - v2.z) / 2.0);
            v12 = new vec3(v12.x / v12.length() / 2, v12.y / v12.length() / 2, v12.z / v12.length() / 2);
            v13 = new vec3(v13.x / v13.length() / 2, v13.y / v13.length() / 2, v13.z / v13.length() / 2);
            v23 = new vec3(v23.x / v23.length() / 2, v23.y / v23.length() / 2, v23.z / v23.length() / 2);

            newTriangles.push(new Triangle(v1, v13, v12));
            newTriangles.push(new Triangle(v12, v23, v2));
            newTriangles.push(new Triangle(v13, v3, v23));
            newTriangles.push(new Triangle(v13, v23, v12));
        }
        
        this.triangles = newTriangles;
    }
    
}

function DotProduct(vec1, vec2) {
    return (vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z) / (vec1.length() * vec2.length());
}
function Distance(pnt1, pnt2) {
    return Math.sqrt(Math.pow(pnt2.x - pnt1.x, 2) + Math.pow(pnt2.y - pnt1.y, 2) + Math.pow(pnt2.z - pnt1.z, 2))
}


var mainModel = new Model();


var rotateX = 0,
    rotateY = 0,
    rotateZ = 0;
var perspective = false;
var displayModeFill = true;

var ctx;
var modelSource;


var fov = 90.0;

//get canvas and context
var canvas = document.getElementById('main-canvas');
if (canvas.getContext) {
    ctx = canvas.getContext('2d');
}

function ToggleDrawMode() {
    displayModeFill = !displayModeFill;
}

function ToggleProjection() {
    perspective = !perspective;
}

function SubdivideTriangles(){
    mainModel.SubdivideTriangles();
}

function Redraw() {
    let rotY = new Date().getTime() / 1200.0;

    let mRotate = CreateRotationMatrix(rotateX, rotateY + rotY, rotateZ, 1);

    //let mProjection = CreateProjectionMatrix(fov, 1, 0.1, 1000.0);
    //let mMP = MultMatrix(mProjection,mRotate);

    ctx.clearRect(0, 0, windowWidth, windowHeight);
    mainModel.Draw(mRotate);
}


function CreateOneMatrix() {
    let M = new Array();
    M[0] = new Array();
    M[1] = new Array();
    M[2] = new Array();
    M[3] = new Array();

    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++) {
            if (i == j) M[i][j] = 1;
            else M[i][j] = 0;
        }
    return M;
}

function CreateRotationMatrix(angleX, angleY, angleZ, scale) {
    let xM = CreateOneMatrix();
    xM[1][1] = Math.cos(angleX * scale);
    xM[2][2] = Math.cos(angleX * scale);
    xM[1][2] = -Math.sin(angleX * scale);
    xM[2][1] = Math.sin(angleX * scale);

    let yM = CreateOneMatrix();
    yM[0][0] = Math.cos(angleY * scale);
    yM[2][2] = Math.cos(angleY * scale);
    yM[2][0] = -Math.sin(angleY * scale);
    yM[0][2] = Math.sin(angleY * scale);

    let zM = CreateOneMatrix();
    zM[0][0] = Math.cos(angleZ * scale);
    zM[1][1] = Math.cos(angleZ * scale);
    zM[1][0] = -Math.sin(angleZ * scale);
    zM[0][1] = Math.sin(angleZ * scale);

    let xyM = MultMatrix(xM, yM);
    let xyzM = MultMatrix(xyM, zM);
    return xyzM;
}

// function CreaeteTranslationMatrix(x, y, z) {
//     let M = CreateOneMatrix();
//     M[0][3] = x;
//     M[1][3] = y;
//     M[2][3] = z;
//     return M;
// }

// function CreateScaleMatrix(x, y, z) {
//     let M = CreateOneMatrix();
//     M[0][0] = x;
//     M[1][1] = y;
//     M[2][2] = z;
//     return M;
// }

// function CreateProjectionMatrix(fovRadians, aspect, near , far) {
//     f = Math.tan(Math.PI * 0.5 - 0.5 * fovRadians);
//     rangeInv = 1.0 / (near - far);

//     let M =[[f / aspect, 0, 0, 0],
//             [0, f, 0, 0],
//             [0, 0, (near + far) * rangeInv, -1],
//             [0, 0, near * far * rangeInv * 2, 0]];
//     return M;
// }


function multPointMatrix(inP, M) {
    let out = new vec3();
    out.x = inP.x * M[0][0] + inP.y * M[0][1] + inP.z * M[0][2] + /* in.z = 1 */ M[0][3];
    out.y = inP.x * M[1][0] + inP.y * M[1][1] + inP.z * M[1][2] + /* in.z = 1 */ M[1][3];
    out.z = inP.x * M[2][0] + inP.y * M[2][1] + inP.z * M[2][2] + /* in.z = 1 */ M[2][3];
    let w = inP.x * M[3][0] + inP.y * M[3][1] + inP.z * M[3][2] + /* in.z = 1 */ M[3][3];

    //(convert from homogeneous to Cartesian coordinates)
    out.x /= w;
    out.y /= w;
    out.z /= w;

    return out;
}

function MultMatrix(m1, m2) {
    let m3 = new Array();
    m3[0] = new Array();
    m3[1] = new Array();
    m3[2] = new Array();
    m3[3] = new Array();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            m3[i][j] = (m1[0][i] * m2[j][0]) + (m1[1][i] * m2[j][1]) + (m1[2][i] * m2[j][2]) + (m1[3][i] * m2[j][3]);
        }
    }
    return m3;
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