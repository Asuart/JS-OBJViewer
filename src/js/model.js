// require vectors.js matrices.js mesh.js obj-parser.js q-sort.js

class Model {
    constructor(source) {
        this.position = new vec3(0, 0, 0);
        this.rotation = new vec3(0, 0, 0);
        this.scale = new vec3(1, 1, 1);
        this.mModel = undefined;
        this.mesh = undefined;

        this._UpdateModelMatrix();
        if (source) this.Load(source);
    }

    Clone() {
        let clone = new Model();
        clone.position = this.position.Clone();
        clone.rotation = this.rotation.Clone();
        clone.scale = this.scale.Clone();
        clone.mesh = this.mesh ? this.mesh.Clone() : undefined;
        return clone;
    }

    Load(source) {
        let parseResult = ParseObj(source);
        let vertices = parseResult.vertices;
        let indices = parseResult.indices;

        let min = new vec3();
        for (let i = 0; i < vertices.length; i++) {
            min.x = Math.min(min.x, vertices[i].position.x);
            min.y = Math.min(min.y, vertices[i].position.y);
            min.z = Math.min(min.z, vertices[i].position.z);
        }
        for (let i = 0; i < vertices.length; i++) {
            vertices[i].position.SubV3(min);
        }

        let max = new vec3();
        let maxDistance = 0;
        for (let i = 0; i < vertices.length; i++) {
            max.x = Math.max(max.x, vertices[i].position.x);
            max.y = Math.max(max.y, vertices[i].position.y);
            max.z = Math.max(max.z, vertices[i].position.z);
            maxDistance = Math.max(maxDistance, vertices[i].position.length);
        }

        let maxDimension = Math.max(max.Max(), maxDistance);
        let offset = max.DivideValue(maxDimension * 2.0);
        for (let i = 0; i < vertices.length; i++) {
            vertices[i].position.DivideValue(maxDimension);
            vertices[i].position.SubV3(offset);
        }

        this.mesh = new Mesh(vertices, indices);
    }

    SortTriangles(viewPoint) {
        let distances = new Array();
        for (let i = 0; i < this.mesh.indices.length; i += 3) {
            let v0 = this.mesh.vertices[this.mesh.indices[i + 0]];
            let v1 = this.mesh.vertices[this.mesh.indices[i + 1]];
            let v2 = this.mesh.vertices[this.mesh.indices[i + 2]];
            let center = vec3.Sum(v0.position, v1.position, v2.position).DivideValue(3);;
            let distance = vec3.Distance(center, viewPoint);
            distances.push({
                index: i,
                value: distance,
            });
        }

        distances.sort(function (a, b) { return b.value - a.value; });

        let newIndices = [];
        for (let i = 0; i < distances.length; i++) {
            newIndices.push(this.mesh.indices[distances[i].index + 0]);
            newIndices.push(this.mesh.indices[distances[i].index + 1]);
            newIndices.push(this.mesh.indices[distances[i].index + 2]);
        }
        this.mesh.indices = newIndices;

        return this;
    }

    ApplyMatrix(mvp) {
        for (let i = 0; i < this.mesh.vertices.length; i++) {
            this.mesh.vertices[i].position = mat4.MultipliedV4(mvp, this.mesh.vertices[i].position.AsVec4(0)).AsVec3();
        }
    }

    SubdivideTriangles() {
        let newIndices = new Array();
        for (let i = 0; i < this.mesh.indices.length; i += 3) {
            let v1 = this.mesh.vertices[this.mesh.indices[i + 0]].position;
            let v2 = this.mesh.vertices[this.mesh.indices[i + 1]].position;
            let v3 = this.mesh.vertices[this.mesh.indices[i + 2]].position;
            let v12 = new vec3(v1.x + (v2.x - v1.x) / 2.0, v1.y + (v2.y - v1.y) / 2.0, v1.z + (v2.z - v1.z) / 2.0);
            let v13 = new vec3(v1.x + (v3.x - v1.x) / 2.0, v1.y + (v3.y - v1.y) / 2.0, v1.z + (v3.z - v1.z) / 2.0);
            let v23 = new vec3(v2.x + (v3.x - v2.x) / 2.0, v2.y + (v3.y - v2.y) / 2.0, v2.z + (v3.z - v2.z) / 2.0);
            let startIndex = this.mesh.vertices.length;
            this.mesh.vertices.push(
                new Vertex(v12, this.mesh.vertices[this.mesh.indices[i]].normal.Clone()),
                new Vertex(v13, this.mesh.vertices[this.mesh.indices[i]].normal.Clone()),
                new Vertex(v23, this.mesh.vertices[this.mesh.indices[i]].normal.Clone())
            );
            newIndices.push(this.mesh.indices[i + 0], startIndex + 0, startIndex + 1);
            newIndices.push(startIndex + 0, this.mesh.indices[i + 1], startIndex + 2);
            newIndices.push(startIndex + 1, startIndex + 2, this.mesh.indices[i + 2]);
            newIndices.push(startIndex + 1, startIndex + 0, startIndex + 2);
        }
        this.mesh.indices = newIndices;

        this.mesh.RecalculateNormals();

        console.log(this.mesh)
        return this;
    }

    Spherificate() {
        for (let i = 0; i < this.mesh.vertices.length; i++) {
            this.mesh.vertices[i].position.Normalize().MultiplyValue(0.5);
        }
        this.mesh.RecalculateNormals();
        return this;
    }

    _UpdateModelMatrix() {
        let mRotate = mat4.CreateRotation(this.rotation.x, this.rotation.y, this.rotation.z, 1);
        let mTranslate = mat4.CreateTranslation(this.position.x, this.position.y, this.position.z);
        let mScale = mat4.CreateScale(this.scale.x, this.scale.x, this.scale.x);
        let mModel = mat4.Multiply(mRotate, mScale);
        this.mModel = mat4.Multiply(mTranslate, mModel);
    }
}