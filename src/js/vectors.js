class vec {
    get x() { return this.axis[0] }
    set x(v) { this.axis[0] = v }
    get y() { return this.axis[1] }
    set y(v) { this.axis[1] = v }
    get z() { return this.axis[2] }
    set z(v) { this.axis[2] = v }
    get w() { return this.axis[3] }
    set w(v) { this.axis[3] = v }
    get u() { return this.axis[0] }
    set u(v) { this.axis[0] = v }
    get v() { return this.axis[1] }
    set v(v) { this.axis[1] = v }
    get r() { return this.axis[0] }
    set r(v) { this.axis[0] = v }
    get g() { return this.axis[1] }
    set g(v) { this.axis[1] = v }
    get b() { return this.axis[2] }
    set b(v) { this.axis[2] = v }
    get a() { return this.axis[3] }
    set a(v) { this.axis[3] = v }
    get theta() { return this.axis[1] }
    set theta(v) { this.axis[1] = v }
    get phi() { return this.axis[2] }
    set phi(v) { this.axis[2] = v }

    get size() {
        return this.axis.length;
    }

    get length2() {
        let sum = 0;
        for (let i = 0; i < this.axis.length; i++) sum += this.axis[i] * this.axis[i];
        return sum;
    }

    get length() {
        return Math.sqrt(this.length2);
    }

    Set(...axis) {
        for (let i = 0; i < axis.length; i++) this.axis[i] = axis[i];
        return this;
    }

    SetSafe(...axis) {
        for (let i = 0; i < axis.length; i++) this.axis[i] = axis[i] ?? this.axis[i];
        return this;
    }

    Add(...axis) {
        for (let i = 0; i < axis.length; i++) this.axis[i] += axis[i];
        return this;
    }

    Sub(...axis) {
        for (let i = 0; i < axis.length; i++) this.axis[i] -= axis[i];
        return this;
    }

    Multiply(...axis) {
        for (let i = 0; i < axis.length; i++) this.axis[i] *= axis[i];
        return this;
    }

    Divide(...axis) {
        for (let i = 0; i < axis.length; i++) this.axis[i] /= axis[i];
        return this;
    }

    AddValue(v) {
        for (let i = 0; i < this.axis.length; i++) this.axis[i] += v;
        return this;
    }

    SubValue(v) {
        for (let i = 0; i < this.axis.length; i++) this.axis[i] -= v;
        return this;
    }

    MultiplyValue(v) {
        for (let i = 0; i < this.axis.length; i++) this.axis[i] *= v;
        return this;
    }

    DivideValue(v) {
        for (let i = 0; i < this.axis.length; i++) this.axis[i] /= v;
        return this;
    }

    Normalize() {
        let l = this.length;
        for (let i = 0; i < this.axis.length; i++) this.axis[i] /= l;
        return this;
    }

    Abs() {
        for (let i = 0; i < this.axis.length; i++) this.axis[i] = Math.abs(this.axis[i]);
        return this;
    }

    Clamp(min, max) {
        for (let i = 0; i < this.axis.length; i++) this.axis[i] = Clamp(this.axis[i], min, max);
        return this;
    }

    Permute(...indexes) {
        let newAxis = Array(this.axis.length);
        for (let i = 0; i < this.axis.length; i++) newAxis[i] = this.axis[i];
        for (let i = 0; i < indexes.length; i++) newAxis[i] = this.axis[indexes[i]];
        this.axis = newAxis;
        return this;
    }

    Max() {
        return this.axis[this.MaxDimension()];
    }

    MaxDimension() {
        let index = 0;
        for (let i = 1; i < this.axis.length; i++) {
            if (this.axis[i] > this.axis[index]) index = i;
        }
        return index;
    }

    Min() {
        return this.axis[this.MinDimension()];
    }

    MinDimension() {
        let index = 0;
        for (let i = 1; i < this.axis.length; i++) {
            if (this.axis[i] < this.axis[index]) index = i;
        }
        return index;
    }

    IsValid() {
        for (let i = 0; i < this.axis.length; i++) {
            if (isNaN(this.axis[i])) return false;
        }
        return true;
    }
}

class vec2 extends vec {
    constructor(x = 0.0, y = 0.0) {
        super();
        this.axis = [x, y];
    }

    Clone() {
        return new vec2(this.x, this.y);
    }

    AddV2(v2) {
        this.x += v2.x;
        this.y += v2.y;
        return this;
    }

    SubV2(v2) {
        this.x -= v2.x;
        this.y -= v2.y;
        return this;
    }

    MyltiplyV2(v2) {
        this.x *= v2.x;
        this.y *= v2.y;
        return this;
    }

    DivideV2(v2) {
        this.x /= v2.x;
        this.y /= v2.y;
        return this;
    }

    ClampV2(min, max) {
        this.x = Clamp(this.x, min.x, max.x);
        this.y = Clamp(this.y, min.y, max.y);
        return this;
    }

    Print(name) {
        console.log(`${name ? name + ": " : ""}vec2(${this.x}, ${this.y}) length(${this.length})`);
    }

    static Sum(...vectors) {
        let v = vectors[0].Clone();
        for (let i = 1; i < vectors.length; i++) v.AddV2(vectors[i]);
        return v;
    }

    static Difference(v0, v1) {
        return new vec2(v0.x - v1.x, v0.y - v1.y);
    }

    static Distance(v0, v1) {
        return vec2.Length(v0.x - v1.x, v0.y - v1.y);
    }

    static DestanceSimple(x0, y0, x1, y1) {
        return vec2.Length(x0 - x1, y0 - y1);
    }

    static Dot(v0, v1) {
        return (v0.x * v1.x + v0.y * v1.y) / (v0.length * v1.length);
    }

    static DotSimple(x0, y0, x1, y1) {
        return (x0 * x1 + y0 * y1) / (vec2.Length(x0, y0) * vec2.Length(x1, y1));
    }

    static NormalsDot(v0, v1) {
        return v0.x * v1.x + v0.y * v1.y;
    }

    static Length(x, y) {
        return Math.sqrt(x * x + y * y);
    }

    static Abs(v2) {
        return new vec2(Math.abs(v2.x), Math.abs(v2.y));
    }

    static Permute(v2, xIndex = 0, yIndex = 1) {
        return new vec2(v2.axis[xIndex], v2.axis[yIndex]);
    }

    static Max(v0, v1) {
        return new vec2(Math.max(v0.x, v1.x), Math.max(v0.y, v1.y));
    }

    static Min(v0, v1) {
        return new vec2(Math.min(v0.x, v1.x), Math.min(v0.y, v1.y));
    }
}

class vec3 extends vec {

    constructor(x = 0.0, y = 0.0, z = 0.0) {
        super();
        this.axis = [x, y, z];
    }

    Clone() {
        return new vec3(this.x, this.y, this.z);
    }

    AsVec4(w = 0) {
        return new vec4(this.x, this.y, this.z, w);
    }

    static FromPolar(r, theta, phi) {
        let x = r * Math.cos(theta) * Math.cos(phi);
        let y = r * Math.sin(phi);
        let z = r * Math.sin(theta) * Math.cos(phi);
        return new vec3(x, y, z);
    }

    AddV3(v3) {
        this.x += v3.x;
        this.y += v3.y;
        this.z += v3.z;
        return this;
    }

    SubV3(v3) {
        this.x -= v3.x;
        this.y -= v3.y;
        this.z -= v3.z;
        return this;
    }

    MultiplyV3(v3) {
        this.x *= v3.x;
        this.y *= v3.y;
        this.z *= v3.z;
        return this;
    }

    DivideV3(v3) {
        this.x /= v3.x;
        this.y /= v3.y;
        this.z /= v3.z;
        return this;
    }

    RotateAround(origin, x, y, z) {
        var cosa = Math.cos(z);
        var sina = Math.sin(z);

        var cosb = Math.cos(x);
        var sinb = Math.sin(x);

        var cosc = Math.cos(y);
        var sinc = Math.sin(y);

        var Axx = cosa * cosb;
        var Axy = cosa * sinb * sinc - sina * cosc;
        var Axz = cosa * sinb * cosc + sina * sinc;

        var Ayx = sina * cosb;
        var Ayy = sina * sinb * sinc + cosa * cosc;
        var Ayz = sina * sinb * cosc - cosa * sinc;

        var Azx = -sinb;
        var Azy = cosb * sinc;
        var Azz = cosb * cosc;

        var px = this.x - origin.x;
        var py = this.y - origin.y;
        var pz = this.z - origin.z;

        this.x = Axx * px + Axy * py + Axz * pz + origin.x;
        this.y = Ayx * px + Ayy * py + Ayz * pz + origin.y;
        this.z = Azx * px + Azy * py + Azz * pz + origin.z;

        return this;
    }

    ToPolar() {
        let r = this.length;
        let phi = Math.acos(this.y / r);
        let theta = Math.sign(this.x) * Math.acos(this.z / Math.sqrt(this.x * this.x + this.z * this.z));
        this.Set(r, theta, phi);
        return this;
    }

    ToCartesian() {
        let x = this.r * Math.sin(this.phi) * Math.sin(this.theta);
        let y = this.r * Math.cos(this.phi);
        let z = this.r * Math.sin(this.phi) * Math.cos(this.theta);
        this.Set(x, y, z);
        return this;
    }

    ClampV3(min, max) {
        this.x = Clamp(this.x, min.x, max.x);
        this.y = Clamp(this.y, min.y, max.y);
        this.z = Clamp(this.z, min.z, max.z);
        return this;
    }

    Print(name) {
        console.log(`${name ? name + ": " : ""}vec3(${this.x}, ${this.y}, ${this.z}) length(${this.length})`);
        return this;
    }

    static Sum(...vectors) {
        let v = vectors[0].Clone();
        for (let i = 1; i < vectors.length; i++) v.AddV3(vectors[i]);
        return v;
    }

    static Difference(v0, v1) {
        return new vec3(v0.x - v1.x, v0.y - v1.y, v0.z - v1.z);
    }

    static Distance(v0, v1) {
        return vec3.Length(v0.x - v1.x, v0.y - v1.y, v0.z - v1.z);
    }

    static DistanceSimple(x0, y0, z0, x1, y1, z1) {
        return vec3.Length(x0 - x1, y0 - y1, z0 - z1);
    }

    static Dot(v0, v1) {
        return (v0.x * v1.x + v0.y * v1.y + v0.z * v1.z) / (v0.length * v1.length);
    }

    static DotSimple(x0, y0, z0, x1, y1, z1) {
        return (x0 * x1 + y0 * y1 + z0 * z1) / (vec3.Length(x0, y0, z0) * vec3.Length(x1, y1, z1));
    }

    static NormalsDot(v0, v1) {
        return v0.x * v1.x + v0.y * v1.y + v0.z * v1.z;
    }

    static Cross(v0, v1) {
        return new vec3(v0.y * v1.z - v0.z * v1.y, v0.z * v1.x - v0.x * v1.z, v0.x * v1.y - v0.y * v1.x);
    }

    static Length(x, y, z) {
        return Math.sqrt(x * x + y * y + z * z);
    }

    static Abs(v3) {
        return new vec2(Math.abs(v3.x), Math.abs(v3.y), Math.abs(v3.z));
    }

    static Permute(v3, xIndex = 0, yIndex = 1, zIndex = 2) {
        return new vec3(v3.axis[xIndex], v3.axis[yIndex], v3.axis[zIndex]);
    }

    static Max(v0, v1) {
        return new vec3(Math.max(v0.x, v1.x), Math.max(v0.y, v1.y), Math.max(v0.z, v1.z));
    }

    static Min(v0, v1) {
        return new vec3(Math.min(v0.x, v1.x), Math.min(v0.y, v1.y), Math.min(v0.z, v1.z));
    }

    static PolatFromCartesian(v3) {
        return v3.Clone().ToPolar();
    }

    static CartesianFromPolar(v3) {
        return v3.Clone().ToCartesian();
    }
}

class vec4 extends vec {
    constructor(x = 0.0, y = 0.0, z = 0.0, w = 0.0) {
        super();
        this.axis = [x, y, z, w];
    }

    Clone() {
        return new vec4(this.x, this.y, this.z, this.w);
    }

    AsVec3() {
        return new vec3(this.x, this.y, this.z);
    }

    AddV4(v4) {
        this.x += v4.x;
        this.y += v4.y;
        this.z += v4.z;
        this.w += v4.w;
        return this;
    }

    SubV4(v4) {
        this.x -= v4.x;
        this.y -= v4.y;
        this.z -= v4.z;
        this.w -= v4.w;
        return this;
    }

    MultiplyV4(v4) {
        this.x *= v4.x;
        this.y *= v4.y;
        this.z *= v4.z;
        this.w *= v4.w;
        return this;
    }

    DivideV4(v4) {
        this.x /= v4.x;
        this.y /= v4.y;
        this.z /= v4.z;
        this.w /= v4.w;
        return this;
    }

    ClampV4(min, max) {
        this.x = Clamp(this.x, min.x, max.x);
        this.y = Clamp(this.y, min.y, max.y);
        this.z = Clamp(this.z, min.z, max.z);
        this.w = Clamp(this.w, min.w, max.w);
        return this;
    }

    Print(name) {
        console.log(`${name ? name + ": " : ""}vec4(${this.x}, ${this.y}, ${this.z}, ${this.w}) length(${this.length})`);
    }

    static Sum(...vectors) {
        let v = vectors[0].Clone();
        for (let i = 1; i < vectors.length; i++) v.AddV4(vectors[i]);
        return v;
    }

    static Difference(v0, v1) {
        return new vec4(v0.x - v1.x, v0.y - v1.y, v0.z - v1.z, v0.w - v1.w);
    }

    static Distance(v0, v1) {
        return vec4.Length(v0.x - v1.x, v0.y - v1.y, v0.z - v1.z, v0.w - v1.w);
    }

    static Dot(v0, v1) {
        return (v0.x * v1.x + v0.y * v1.y + v0.z * v1.z + v0.w * v1.w) / (v0.length * v1.length);
    }

    static Length(x, y, z, w) {
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    static Abs(v4) {
        return new vec4(Math.abs(v4.x), Math.abs(v4.y), Math.abs(v4.z), Math.abs(v4.w));
    }

    static Permute(v4, xIndex = 0, yIndex = 1, zIndex = 2, wIndex = 3) {
        return new vec4(v4.axis[xIndex], v4.axis[yIndex], v4.axis[zIndex], v4.axis[wIndex]);
    }

    static Max(v0, v1) {
        return new vec4(Math.max(v0.x, v1.x), Math.max(v0.y, v1.y), Math.max(v0.z, v1.z), Math.max(v0.w, v1.w));
    }

    static Min(v0, v1) {
        return new vec4(Math.min(v0.x, v1.x), Math.min(v0.y, v1.y), Math.min(v0.z, v1.z), Math.min(v0.w, v1.w));
    }
}