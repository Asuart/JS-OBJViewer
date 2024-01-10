var preloadedModels = {
    octahedron: "v 0.000000 1.000000 0.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 0.000000 1.000000\nv 0.000000 1.000000 0.000000\nv 0.000000 0.000000 1.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv 0.000000 0.000000 1.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 0.000000 1.000000\nv 0.000000 1.000000 0.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 0.000000 -1.000000\nv 0.000000 1.000000 0.000000\nv 0.000000 0.000000 -1.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv 0.000000 0.000000 -1.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 0.000000 -1.000000\nf 1 2 3\nf 4 5 6\nf 7 8 9\nf 10 11 12\nf 13 14 15\nf 16 17 18\nf 19 20 21\nf 22 23 24",
    cube: "v 1.000000 -1.000000 -1.000000\nv 1.000000 -1.000000 1.000000\nv -1.000000 -1.000000 1.000000\nv -1.000000 -1.000000 -1.000000\nv 1.000000 1.000000 -0.999999\nv 0.999999 1.000000 1.000001\nv -1.000000 1.000000 1.000000\nv -1.000000 1.000000 -1.000000\nf 2 3 4\nf 8 7 6\nf 5 6 2\nf 6 7 3\nf 3 7 8\nf 1 4 8\nf 1 2 4\nf 5 8 6\nf 1 5 2\nf 2 6 3\nf 4 3 8\nf 5 1 8\n"
}

let objRenderer2D = new OBJViewer("#renderer-2d", "2d");
objRenderer2D.LoadModel(preloadedModels["octahedron"]);

function SwitchDisplayMode2d() {
    objRenderer2D.ChangeDisplayMode();
}

function SubdivideTriangles2d() {
    objRenderer2D.SubdivideTriangles();
}

function Spherificate2d() {
    objRenderer2D.Spherificate();
}

function RecalculateNormals2d() {
    objRenderer2D.RecalculateNormals();
}

document.getElementById('inputfile2d').addEventListener('change', function (e) {
    var reader = new FileReader();
    let file = this.files[0];
    e.target.closest(".dropdown").classList.remove("active");
    e.target.closest(".dropdown").querySelector(".dropdown-value").innerHTML = file.name;
    reader.onload = function () {
        objRenderer2D.LoadModel(reader.result);
    }
    reader.readAsText(file);
});

document.querySelectorAll(".dropdown-option-2d").forEach(function (el) {
    el.addEventListener("click", function (e) {
        if (e.currentTarget.classList.contains("load-file")) return;
        objRenderer2D.LoadModel(preloadedModels[e.currentTarget.dataset.src]);
        e.target.closest(".dropdown").querySelector(".dropdown-value").innerHTML = (e.currentTarget.dataset.src + ".obj");
    });
});

let objRendererWEBGL = new OBJViewer("#renderer-webgl", "webgl");
objRendererWEBGL.LoadModel(preloadedModels["octahedron"]);

function SubdivideTriangles() {
    objRendererWEBGL.SubdivideTriangles();
}

function Spherificate() {
    objRendererWEBGL.Spherificate();
}

function RecalculateNormals() {
    objRendererWEBGL.RecalculateNormals();
}

document.getElementById('inputfile').addEventListener('change', function (e) {
    var reader = new FileReader();
    let file = this.files[0];
    e.target.closest(".dropdown").classList.remove("active");
    e.target.closest(".dropdown").querySelector(".dropdown-value").innerHTML = file.name;
    reader.onload = function () {
        objRendererWEBGL.LoadModel(reader.result);
    }
    reader.readAsText(file);
});

document.querySelectorAll(".dropdown-option-webgl").forEach(function (el) {
    el.addEventListener("click", function (e) {
        if (e.currentTarget.classList.contains("load-file")) return;
        objRendererWEBGL.LoadModel(preloadedModels[e.currentTarget.dataset.src]);
        e.target.closest(".dropdown").querySelector(".dropdown-value").innerHTML = (e.currentTarget.dataset.src + ".obj");
    });
});

document.addEventListener("click", function (e) {
    let dropdownEl = e.target.closest(".dropdown");
    if (dropdownEl) {
        dropdownEl.classList.toggle("active");
    }
});