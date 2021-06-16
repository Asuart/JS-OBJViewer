// requires vec3 js

class Triangle {
    // recieve vec3 values
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
        let cross = CrossProduct(vec1, vec2);
        cross.normalize();
        return cross;
    }
    copy() {
        return new Triangle(this.v0.copy(), this.v1.copy(), this.v2.copy());
    }
}