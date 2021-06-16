// require vec3.js triangle.js obj-parser.js q-sort.js

class Model {
    constructor(source) {
        this.position = new vec3(0, 0, 0);
        this.rotation = new vec3(0, 0, 0);
        this.scale = new vec3(1, 1, 1);
        if (source == undefined) source = "v 0.000000 1.000000 0.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 0.000000 1.000000\nv 0.000000 1.000000 0.000000\nv 0.000000 0.000000 1.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv 0.000000 0.000000 1.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 0.000000 1.000000\nv 0.000000 1.000000 0.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 0.000000 -1.000000\nv 0.000000 1.000000 0.000000\nv 0.000000 0.000000 -1.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv 0.000000 0.000000 -1.000000\nv 1.000000 0.000000 0.000000\nv 0.000000 -1.000000 0.000000\nv -1.000000 0.000000 0.000000\nv 0.000000 0.000000 -1.000000\nf 1 2 3\nf 4 5 6\nf 7 8 9\nf 10 11 12\nf 13 14 15\nf 16 17 18\nf 19 20 21\nf 22 23 24"
        this.Load(source);
    }
    Load(source) {
        let parseResult = ParseObj(source);
        let vertices = parseResult.vertices;
        let indexes = parseResult.indexes;

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
        let maxX = 0,
            maxY = 0,
            maxZ = 0;
        for (let i = 0; i < vertices.length; i++) {
            if (vertices[i].x > max) max = vertices[i].x;
            if (vertices[i].y > max) max = vertices[i].y;
            if (vertices[i].z > max) max = vertices[i].z;

            if (vertices[i].x > maxX) maxX = vertices[i].x;
            if (vertices[i].y > maxY) maxY = vertices[i].y;
            if (vertices[i].z > maxZ) maxZ = vertices[i].z;
        }
        for (let i = 0; i < vertices.length; i++) {
            vertices[i].x /= max;
            vertices[i].y /= max;
            vertices[i].z /= max;
            vertices[i].x -= maxX / max / 2.0;
            vertices[i].y -= maxY / max / 2.0;
            vertices[i].z -= maxZ / max / 2.0;
        }

        this.triangles = new Array();
        for (let i = 0; i < indexes.length / 3; i++)
            this.triangles.push(new Triangle(vertices[indexes[i * 3]], vertices[indexes[i * 3 + 1]], vertices[indexes[i * 3 + 2]]));
    }
    SortTriangles() {
        let distances = new Array();
        let start = new vec3(0, 0, -1);
        for (let i = 0; i < this.triangles.length; i++) distances[i] = this.triangles[i].distance(start);
        q_sort_associative(distances, this.triangles); // specific implimentation fo two arrays. #from qsort.js
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
    SubdivideTriangles() {
        let newTriangles = new Array();

        for (let i = 0; i < this.triangles.length; i++) {
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
    center() {
        let v = new vec3(0, 0, 0);
        for (let i = 0; i < this.triangles.length; i++) {
            let c = this.triangles[i].center();
            v.x += c.x;
            v.y += c.y;
            v.z += c.z;
        }
        v.x /= this.triangles.length;
        v.y /= this.triangles.length;
        v.z /= this.triangles.length;
        return v;
    }
    GetModelMatrix() {
        let mRotate = CreateRotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z, 1);
        let mTranslate = CreaeteTranslationMatrix(this.position.x, this.position.y, this.position.z);
        let mScale = CreateScaleMatrix(this.scale.x, this.scale.x, this.scale.x);

        let mModel = CreateOneMatrix();
        mModel = MultMatrix(mScale, mModel);
        mModel = MultMatrix(mRotate, mModel);
        mModel = MultMatrix(mTranslate, mModel);

        return mModel;
    }
}