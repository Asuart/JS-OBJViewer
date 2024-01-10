class OBJViewer {
    static DisplayModes = { StrokeFill: 0, Fill: 1, Stroke: 2, COUNT: 3 };

    constructor(selector = "#obj-viewer", mode = "webgl") {
        this.container = document.querySelector(selector);
        if (!this.container) {
            throw new Error("Couldn't find element specified by selector: '" + selector + "'");
        }

        if (mode == "webgl") {
            this.canvas = new CanvasWEBGL("", this.container.offsetWidth, this.container.offsetHeight);
        } else if (mode == "2d") {
            this.canvas = new Canvas2D("", this.container.offsetWidth, this.container.offsetHeight);
        } else {
            throw new Error("Unsopported viewing mode: '" + mode + "'");
        }
        this.container.append(this.canvas.element);

        this._InitResizeCallback();
        this._MainLoop();
    }

    LoadModel(objSource) {
        this.mainModel = new Model(objSource);
        this.canvas.SetModel(this.mainModel);
    }

    ChangeDisplayMode() {
        this.canvas.ChangeDisplayMode();
    }

    SetDisplayMode(displayMode) {
        this.canvas.SetDisplayMode(displayMode);
    }

    SubdivideTriangles() {
        this.mainModel.SubdivideTriangles();
        this.canvas.SetModel(this.mainModel);
    }

    Spherificate() {
        this.mainModel.Spherificate();
        this.canvas.SetModel(this.mainModel);
    }

    RecalculateNormals() {
        this.mainModel.mesh.RecalculateNormals();
        this.canvas.SetModel(this.mainModel);
    }

    _InitResizeCallback() {
        window.addEventListener("resize", (e) => {
            this._ResizeContext(this.container.offsetWidth, this.container.offsetHeight);
        });
        this._ResizeContext(this.container.offsetWidth, this.container.offsetHeight);
    }

    _ResizeContext(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.Resize(width, height);
    }

    _MainLoop() {
        this._Update();
        this._Draw();
        window.requestAnimationFrame(() => this._MainLoop());
    }

    _Update() {
        if (!this.mainModel) return;
        this.mainModel.rotation.y += 0.03;
        this.mainModel._UpdateModelMatrix();
    }

    _Draw() {
        this.canvas.Clear();
        if (!this.mainModel) return;
        this.canvas.Draw();
    }
}