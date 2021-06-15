var gl; // глобальная переменная для контекста WebGL

var mainProgram;


var vbo;
var vertexPositionAttribute;


var fragShader = "varying highp vec3 oPos; void main(void) { gl_FragColor = vec4((oPos.x + 1.0) / 2.0,(oPos.y + 1.0) / 2.0, (oPos.z + 1.0) / 2.0, 1.0); }"
var vertShader = "attribute vec3 pos; varying highp vec3 oPos; uniform mat4 uMVMatrix; uniform mat4 uPMatrix; void main(void) { oPos = pos; gl_Position = vec4(pos, 1.0); }"

function start() {
    var canvas = document.getElementById("glcanvas");

    gl = initWebGL(canvas); // инициализация контекста GL

    // продолжать только если WebGL доступен и работает

    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // установить в качестве цвета очистки буфера цвета чёрный, полная непрозрачность
        gl.enable(gl.DEPTH_TEST); // включает использование буфера глубины
        gl.depthFunc(gl.LEQUAL); // определяет работу буфера глубины: более ближние объекты перекрывают дальние
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // очистить буфер цвета и буфер глубины.
        gl.viewport(0, 0, canvas.width, canvas.height);
        CreateMainProgram();
        CreateTriangle();
        DrawScene();
    }
}


function initWebGL(canvas) {
    gl = null;

    try {
        // Попытаться получить стандартный контекст. Если не получится, попробовать получить экспериментальный.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {}

    // Если мы не получили контекст GL, завершить работу
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        gl = null;
    }

    return gl;
}


function CreateMainProgram() {
    mainProgram = gl.createProgram();
    var vertexShader = GetShader(gl, "shader-fs");
    var fragmentShader = GetShader(gl, "shader-vs");
    gl.attachShader(mainProgram, vertexShader);
    gl.attachShader(mainProgram, fragmentShader);
    gl.linkProgram(mainProgram);
    if (!gl.getProgramParameter(mainProgram, gl.LINK_STATUS)) { console.error("Unable to initialize the shader program."); }
    gl.useProgram(mainProgram);
    vertexPositionAttribute = gl.getAttribLocation(mainProgram, "pos");
    gl.enableVertexAttribArray(vertexPositionAttribute);
}


function GetShader(gl, id) {
    var shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);

    if (!shaderScript) {
        return null;
    }

    theSource = "";
    currentChild = shaderScript.firstChild;

    while (currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        // неизвестный тип шейдера
        return null;
    }
    gl.shaderSource(shader, theSource);

    // скомпилировать шейдерную программу
    gl.compileShader(shader);

    // Проверить успешное завершение компиляции
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


function CreateTriangle() {
    let vao = gl.createVertexArray();
    vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    let vertices = [-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.0, 0.5, 0.0];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function DrawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    // perspectiveMatrix = makePerspective(45, 640.0 / 480.0, 0.1, 100.0);

    //loadIdentity();
    //mvTranslate([-0.0, 0.0, -6.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    //setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}