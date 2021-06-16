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
        return this;
    }
    copy() {
        return new vec3(this.x, this.y, this.z);
    }
}

function DotProduct(vec1, vec2) {
    return (vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z) / (vec1.length() * vec2.length());
}

function CrossProduct(vec1, vec2) {
    return new vec3(vec1.y * vec2.z - vec1.z * vec2.y, vec1.z * vec2.x - vec1.x * vec2.z, vec1.x * vec2.y - vec1.y * vec2.x);
}

function Distance(pnt1, pnt2) {
    return Math.sqrt(Math.pow(pnt2.x - pnt1.x, 2) + Math.pow(pnt2.y - pnt1.y, 2) + Math.pow(pnt2.z - pnt1.z, 2))
}