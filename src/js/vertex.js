// requires vectors.js

class Vertex {
    constructor(position = new vec3(), normal = new vec3(), texCoords = new vec2()) {
        this.position = position;
        this.normal = normal;
        this.texCoords = texCoords;
    }

    Clone() {
        return new Vertex(this.position.Clone(), this.normal.Clone(), this.texCoords.Clone());
    }
}