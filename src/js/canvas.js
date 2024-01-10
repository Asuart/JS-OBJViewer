class Canvas {
    constructor(classes, width, height, options) {
        this.width = width;
        this.height = height;
        this.element = CreateCanvas(classes, width, height);
        this.context = this.element.getContext(options);

        this.model = undefined;
        this.useLinearFilter = false;
        this.camera = new Camera();
        this.displayMode = OBJViewer.DisplayModes.StrokeFill;
    }

    Resize(x, y) {
        this.width = x;
        this.height = y;
        this.element.width = x;
        this.element.height = y;
    }

    SetModel(model) {
        this.model = model;
    }

    ToggleTextureFiltering() {
        this.useLinearFilter = !this.useLinearFilter;
    }

    ChangeDisplayMode() {
        this.displayMode = (this.displayMode + 1) % OBJViewer.DisplayModes.COUNT;
    }

    SetDisplayMode(displayMode) {
        this.displayMode = displayMode;
    }

    Clear() { }

    Draw() { }
}

class Canvas2D extends Canvas {
    constructor(classes, width = 0, height = 0) {
        super(classes, width, height, "2d");

        this._UpdatePPU();
        this.context.strokeColor = "#000000";
    }

    Clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    Draw() {
        let mMV = mat4.Multiply(this.camera.GetViewMatrix(), this.model.mModel);
        let mMVP = mat4.Multiply(this.camera.GetProjectionMatrix(), mMV);

        let modelCopy = this.model.Clone();
        modelCopy.ApplyMatrix(mMV);
        modelCopy.SortTriangles(this.camera.position);

        for (var i = 0; i < modelCopy.mesh.indices.length; i += 3) {
            let v1 = this._WorldToScreen(modelCopy.mesh.vertices[modelCopy.mesh.indices[i + 0]].position);
            let v2 = this._WorldToScreen(modelCopy.mesh.vertices[modelCopy.mesh.indices[i + 1]].position);
            let v3 = this._WorldToScreen(modelCopy.mesh.vertices[modelCopy.mesh.indices[i + 2]].position);

            let normal = vec3.Cross(vec3.Difference(v2, v1), vec3.Difference(v3, v1)).Normalize();

            this.context.beginPath();

            this.context.moveTo(v1.x, v1.y);
            this.context.lineTo(v2.x, v2.y);
            this.context.lineTo(v3.x, v3.y);
            this.context.lineTo(v1.x, v1.y);

            switch (this.displayMode) {
                case OBJViewer.DisplayModes.StrokeFill:
                    var dot = Math.abs(vec3.Dot(normal, this.camera.forward));
                    var value = Clamp(Clamp(255 * dot, 0, 255) + 55, 0, 255);
                    this.context.fillStyle = `rgb(${value}, ${value}, 0)`;
                    this.context.fill();
                    this.context.stroke();
                    break;
                case OBJViewer.DisplayModes.Fill:
                    var dot = Math.abs(vec3.Dot(normal, this.camera.forward));
                    var value = Clamp(Clamp(255 * dot, 0, 255) + 55, 0, 255);
                    this.context.fillStyle = `rgb(${value}, ${value}, 0)`;
                    this.context.fill();
                    break;
                default:
                    this.context.stroke();
                    break;
            }

            this.context.closePath();
        }
    }

    Resize(width, height) {
        super.Resize(width, height);
        this._UpdatePPU();
    }

    _UpdatePPU() {
        this.ppu = Math.min(this.width, this.height) * 0.8;
    }

    _WorldToScreen(v) {
        return new vec3(this.ppu * v.x + this.width / 2.0, this.height / 2.0 - this.ppu * v.y, this.ppu * v.z + this.height / 2.0);
    }
}

class CanvasWEBGL extends Canvas {
    constructor(classes, width = 0, height = 0) {
        super(classes, width, height, "webgl");
        this.gl = this.context;

        this.vertexBuffers = [];
        this.textureBuffers = [];

        this.clearColor = new vec4();
        this.clearDepth = 1.0;
        this.pointSize = 5.0;
        this.maxTextureSamplers = 4;
        this.program = undefined;

        if (!this.gl) {
            console.error('Unable to initialize WebGL. Your browser or machine may not support it.');
            return;
        }

        this.gl.getExtension("OES_standard_derivatives");
        this.gl.getExtension("EXT_frag_depth");
        this.gl.getExtension("WEBGL_depth_texture");

        this.gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, this.clearColor.a);
        this.gl.clearDepth(this.clearDepth);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.gl_PointSize = this.pointSize;

        this._InitShaderProgram(DEFAULT_VERTEX_SHADER_SOURCE, DEFAULT_FRAGMENT_SHADER_SOURCE);
    }

    Resize(x, y) {
        super.Resize(x, y);
        this.gl.viewport(0, 0, Math.max(x, 1), Math.max(y, 1));
    }

    SetModel(model) {
        this._FreeGPUBuffers();
        this.model = model;
        this._UploadMesh(model.mesh);
    }

    Draw() {
        let mMV = mat4.Multiply(this.camera.GetViewMatrix(), this.model.mModel);
        let normalTransformMatrix = mat4.CreateNormal(mat4.CreateTransposed(mat4.CreateInverse(mMV)));

        this._SetUniformMat4("uModelViewMatrix", mMV);
        this._SetUniformMat4("uProjectionMatrix", this.camera.GetProjectionMatrix());
        this._SetUniformMat3("uNormalTransformMatrix", normalTransformMatrix);

        this._DrawMesh(this.model.mesh);
    }

    ToggleTextureFiltering() {
        this.useLinearFilter = !this.useLinearFilter;
        this.textureBuffers.forEach((texture) => {
            this._SetTextureFiltering(texture, this.useLinearFilter);
        });
    }

    SetClearColor(r, g, b, a) {
        this.clearColor.SetSafe(r, g, b, a);
        this.gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, this.clearColor.a);
    }

    SetClearDepth(v) {
        this.clearDepth = v;
        this.gl.clearDepth(v);
    }

    ReadPixels(x, y, width, height, buffer) {
        this.gl.readPixels(x, y, width, height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, buffer);
    }

    _UseProgram(program) {
        this.program = program;
        this.gl.useProgram(program);
        return this;
    }

    _InitShaderProgram(vsSource, fsSource) {
        let vertexShader = this._LoadShader(this.gl.VERTEX_SHADER, vsSource);
        let fragmentShader = this._LoadShader(this.gl.FRAGMENT_SHADER, fsSource);

        let shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        this._UseProgram(shaderProgram);

        return this;
    }

    _LoadShader(type, source) {
        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    _UploadMesh(mesh) {
        if (this.vertexBuffers[mesh.id] === undefined) {
            this.vertexBuffers[mesh.id] = this.gl.createBuffer();
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffers[mesh.id]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(mesh.ToArray()), this.gl.STATIC_DRAW);
    }

    _UploadTexture(texture) {
        if (!texture || !texture.pixels) return;
        if (this.textureBuffers[texture.id] === undefined) {
            this.textureBuffers[texture.id] = this.gl.createTexture();
        }
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureBuffers[texture.id]);

        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, texture.width, texture.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.pixels.data);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this._SetTextureFiltering(this.textureBuffers[texture.id], this.useLinearFilter);

        this.gl.bindTexture(this.gl.TEXTURE_2D, undefined);
    }

    _SetTextureFiltering(textureBuffer, linear) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, textureBuffer);

        if (linear) {
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        } else {
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        }

        this.gl.bindTexture(this.gl.TEXTURE_2D, undefined);
    }

    _BindFramebuffer(framebuffer) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
    }

    _UnbindFramebuffer() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    _InitNewFrameBuffer(width, height, linearFilter = false) {
        width = Clamp(width, Settings.minTextureSize, Settings.maxTextureSize);
        height = Clamp(height, Settings.minTextureSize, Settings.maxTextureSize);

        let depthBuffer = this.CreateTargetDepthTexture(width, height);
        let textureBuffer = this.CreateTargetTexture(width, height, linearFilter);

        let frameBuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, textureBuffer, 0);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, depthBuffer, 0);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        return { frame: frameBuffer, texture: textureBuffer, depth: depthBuffer, size: new vec2(width, height), linear: linearFilter };
    }

    _DeleteFramebuffer(target) {
        this.gl.deleteFramebuffer(target.frame);
        this.gl.deleteTexture(target.depth);
        this.gl.deleteTexture(target.texture);
    }

    _ResizeTargetFrameBuffer(target, width, height) {
        width = Clamp(width, Settings.minTextureSize, Settings.maxTextureSize);
        height = Clamp(height, Settings.minTextureSize, Settings.maxTextureSize);
        this._DeleteFramebuffer(target);
        return this._InitNewFrameBuffer(width, height, target.linear);
    }

    _CreateTargetTexture(width, height, linearFilter = false) {
        let textureBuffer = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, textureBuffer);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, linearFilter ? this.gl.LINEAR : this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        return textureBuffer;
    }

    _CreateTargetDepthTexture(width, height) {
        let depthTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, depthTexture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.DEPTH_COMPONENT, width, height, 0, this.gl.DEPTH_COMPONENT, this.gl.UNSIGNED_SHORT, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        return depthTexture;
    }

    _SetUniformInteger(name, integer) {
        let uniformLoc = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform1i(uniformLoc, integer);
    }

    _SetUniformFloat(name, float) {
        let uniformLoc = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform1f(uniformLoc, float);
    }

    _SetUniformVec2(name, vec) {
        let uniformLoc = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform2fv(uniformLoc, new Float32Array(vec.axis));
    }

    _SetUniformVec3(name, vec) {
        let uniformLoc = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform3fv(uniformLoc, new Float32Array(vec.axis));
    }

    _SetUniformVec4(name, vec) {
        let uniformLoc = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform4fv(uniformLoc, new Float32Array(vec.axis));
    }

    _SetUniformMat2(name, mat) {
        let uniformLoc = this.gl.getUniformLocation(this.program, name);
        this.gl.uniformMatrix2fv(uniformLoc, false, new Float32Array(mat.arr));
    }

    _SetUniformMat3(name, mat) {
        let uniformLoc = this.gl.getUniformLocation(this.program, name);
        this.gl.uniformMatrix3fv(uniformLoc, false, new Float32Array(mat.arr));
    }

    _SetUniformMat4(name, mat) {
        let uniformLoc = this.gl.getUniformLocation(this.program, name);
        this.gl.uniformMatrix4fv(uniformLoc, false, new Float32Array(mat.arr));
    }

    _SetSampler2D(name, texture, textureBase) {
        if (textureBase >= this.maxTextureSamplers) return;
        this._SetUniformInteger(name, textureBase);
        this.gl.activeTexture(this.gl.TEXTURE0 + textureBase);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    }

    _ResetSamplers() {
        for (let i = 0; i < this.maxTextureSamplers; i++) {
            this.gl.activeTexture(this.gl.TEXTURE0 + i);
            this.gl.bindTexture(this.gl.TEXTURE_2D, undefined);
        }
    }

    _SetAttribLocation(name, size, type, normalize, length, offset) {
        let loc = this.gl.getAttribLocation(this.program, name);
        if (loc == -1) return;
        this.gl.vertexAttribPointer(loc, size, type, normalize, length, offset);
        this.gl.enableVertexAttribArray(loc);
    }

    _SetMaterialUniforms(material) {
        this._SetUniformInteger('uUseColorSampler', (material.mapDiffuse !== undefined) ? 1 : 0);
        if (material.mapDiffuse) {
            this._SetSampler2D("uColorSampler", this.textureBuffers[material.mapDiffuse.id], 0);
        }
        this._SetUniformVec3("uColorAmbient", material.colorAmbient);
        this._SetUniformVec3("uColorDiffuse", material.colorDiffuse);
    }

    _Clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    _DrawMesh(mesh) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffers[mesh.id]);
        this._SetAttribLocation('pos', 3, this.gl.FLOAT, false, 32, 0);
        this._SetAttribLocation('normal', 3, this.gl.FLOAT, false, 32, 12);
        this._SetAttribLocation('tex', 2, this.gl.FLOAT, false, 32, 24);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.indices.length);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, undefined);
    }

    _FreeGPUBuffers() {
        this.vertexBuffers.forEach((element) => {
            this.gl.deleteBuffer(element);
        });
        this.vertexBuffers = [];
        this.textureBuffers.forEach((element) => {
            this.gl.deleteTexture(element);
        });
        this.textureBuffers = [];
    }
}