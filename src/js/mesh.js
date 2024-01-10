// requires vertex.js

class Mesh {
    static counter = 0;

    constructor(vertices = [], indices = []) {
        this.id = Mesh.counter++;
        this.vertices = vertices;
        this.indices = indices;
    }

    Clone() {
        let clone = new Mesh();
        for (let i = 0; i < this.vertices.length; i++) {
            clone.vertices[i] = this.vertices[i].Clone();
        }
        for (let i = 0; i < this.indices.length; i++) {
            clone.indices[i] = this.indices[i];
        }
        return clone;
    }

    RecalculateNormals() {
        for (let i = 0; i < this.indices.length; i++) {
            this.vertices[this.indices[i]].normal.Set(0, 0, 0);
        }
        for (let i = 0; i < this.indices.length; i += 3) {
            let v1 = this.vertices[this.indices[i + 0]].position;
            let v2 = this.vertices[this.indices[i + 1]].position;
            let v3 = this.vertices[this.indices[i + 2]].position;
            let normal = vec3.Cross(vec3.Difference(v2, v1), vec3.Difference(v3, v1)).Normalize();
            this.vertices[this.indices[i + 0]].normal.AddV3(normal);
            this.vertices[this.indices[i + 1]].normal.AddV3(normal);
            this.vertices[this.indices[i + 2]].normal.AddV3(normal);
        }
        for (let i = 0; i < this.indices.length; i++) {
            this.vertices[this.indices[i]].normal.Normalize();
        }
    }

    ToArray() {
        let arr = [];
        for (let i = 0; i < this.indices.length; i++) {
            let v = this.vertices[this.indices[i]];
            arr.push(v.position.x);
            arr.push(v.position.y);
            arr.push(v.position.z);
            arr.push(v.normal.x);
            arr.push(v.normal.y);
            arr.push(v.normal.z);
            arr.push(v.texCoords.x);
            arr.push(v.texCoords.y);
        }
        return arr;
    }
}
