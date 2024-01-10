class mat {
    constructor(size) {
        this.size = size;
        this.size2 = size * size;
        this.arr = Array(this.size2);
        for (let i = 0; i < this.size2; i++) this.arr[i] = 0;
    }

    Set(col, row, v) {
        this.arr[col + row * this.size] = v;
        return this;
    }

    Get(col, row) {
        return this.arr[col + row * this.size];
    }

    AddValue(v) {
        for (let i = 0; i < this.size2; i++) this.arr[i] += v;
        return this;
    }

    SubValue(v) {
        for (let i = 0; i < this.size2; i++) this.arr[i] -= v;
        return this;
    }

    MultiplyValue(v) {
        for (let i = 0; i < this.size2; i++) this.arr[i] *= v;
        return this;
    }

    DivideValue(v) {
        for (let i = 0; i < this.size2; i++) this.arr[i] /= v;
        return this;
    }
}

class mat3 extends mat {

    static size = 3;

    constructor(arr = undefined) {
        super(mat3.size);
        if (arr) {
            this.arr = arr;
        }
    }

    Clone() {
        return new mat3(this.arr.slice());
    }

    static CreateIdentity() {
        let m = new mat3();
        m.arr[0] = 1.0;
        m.arr[4] = 1.0;
        m.arr[8] = 1.0;
        return m;
    }

    static Add(l, r) {
        let arr = new Array(9);
        for (let i = 0; i < 9; i++) {
            arr[i] = l.arr[i] + r.arr[i];
        }
        return new mat3(arr);
    }

    static Multiply(l, r) {
        let arr = new Array(9);
        for (let i = 0; i < 9; i += 3) {
            for (let j = 0; j < 3; j++) {
                arr[i + j] = (r.arr[i + 0] * l.arr[j + 0]) + (r.arr[i + 1] * l.arr[j + 3]) + (r.arr[i + 2] * l.arr[j + 6]);
            }
        }
        return new mat3(arr);
    }

    static MultipliedV3(m3, v3) {
        let result = new vec3();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result.axis[i] += m3.arr[i + j * 3] * v3.axis[j];
            }
        }
        return result;
    }

    static CreateTransposed(mat) {
        let arr = new Array(9);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                arr[i + j * 3] = mat.arr[j + i * 3];
            }
        }
        return new mat3(arr);
    }
}

class mat4 extends mat {

    static size = 4;

    constructor(arr = undefined) {
        super(mat4.size);
        if (arr) {
            this.arr = arr;
        }
    }

    Clone() {
        return new mat4(this.arr.slice());
    }

    static CreateIdentity() {
        let m = new mat4();
        m.arr[0] = 1.0;
        m.arr[5] = 1.0;
        m.arr[10] = 1.0;
        m.arr[15] = 1.0;
        return m;
    }

    static Add(l, r) {
        let arr = new Array(16);
        for (let i = 0; i < 16; i++) {
            arr[i] = l.arr[i] + r.arr[i];
        }
        return new mat4(arr);
    }

    static Multiply(l, r) {
        let arr = new Array(16);
        for (let i = 0; i < 16; i += 4) {
            for (let j = 0; j < 4; j++) {
                arr[i + j] = (r.arr[i + 0] * l.arr[j + 0]) + (r.arr[i + 1] * l.arr[j + 4]) + (r.arr[i + 2] * l.arr[j + 8]) + (r.arr[i + 3] * l.arr[j + 12]);
            }
        }
        return new mat4(arr);
    }

    static MultipliedV4(m4, v4) {
        let result = new vec4();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result.axis[i] += m4.arr[i + j * 4] * v4.axis[j];
            }
        }
        return result;
    }

    static CreateMinor(mat, col, row) {
        let arr = new Array(9);
        for (let i = 0, index = 0; i < 16; i++) {
            if (Math.floor(i / 4) == row || (i % 4) == col)
                continue;
            arr[index++] = mat.arr[i];
        }
        return new mat3(arr);
    }

    static CreateTransposed(mat) {
        let arr = new Array(16);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                arr[i + j * 4] = mat.arr[j + i * 4];
            }
        }
        return new mat4(arr);
    }

    static CreateInverse(mat) {
        let v00 = mat.arr[0] * mat.arr[5] - mat.arr[1] * mat.arr[4];
        let v01 = mat.arr[0] * mat.arr[6] - mat.arr[2] * mat.arr[4];
        let v02 = mat.arr[0] * mat.arr[7] - mat.arr[3] * mat.arr[4];
        let v03 = mat.arr[1] * mat.arr[6] - mat.arr[2] * mat.arr[5];
        let v04 = mat.arr[1] * mat.arr[7] - mat.arr[3] * mat.arr[5];
        let v05 = mat.arr[2] * mat.arr[7] - mat.arr[3] * mat.arr[6];
        let v06 = mat.arr[8] * mat.arr[13] - mat.arr[9] * mat.arr[12];
        let v07 = mat.arr[8] * mat.arr[14] - mat.arr[10] * mat.arr[12];
        let v08 = mat.arr[8] * mat.arr[15] - mat.arr[11] * mat.arr[12];
        let v09 = mat.arr[9] * mat.arr[14] - mat.arr[10] * mat.arr[13];
        let v10 = mat.arr[9] * mat.arr[15] - mat.arr[11] * mat.arr[13];
        let v11 = mat.arr[10] * mat.arr[15] - mat.arr[11] * mat.arr[14];

        let det = v00 * v11 - v01 * v10 + v02 * v09 + v03 * v08 - v04 * v07 + v05 * v06;
        if (!det) {
            return mat4.CreateIdentity();
        }
        det = 1.0 / det;

        return new mat4([
            (mat.arr[5] * v11 - mat.arr[6] * v10 + mat.arr[7] * v09) * det,
            (mat.arr[2] * v10 - mat.arr[1] * v11 - mat.arr[3] * v09) * det,
            (mat.arr[13] * v05 - mat.arr[14] * v04 + mat.arr[15] * v03) * det,
            (mat.arr[10] * v04 - mat.arr[9] * v05 - mat.arr[11] * v03) * det,
            (mat.arr[6] * v08 - mat.arr[4] * v11 - mat.arr[7] * v07) * det,
            (mat.arr[0] * v11 - mat.arr[2] * v08 + mat.arr[3] * v07) * det,
            (mat.arr[14] * v02 - mat.arr[12] * v05 - mat.arr[15] * v01) * det,
            (mat.arr[8] * v05 - mat.arr[10] * v02 + mat.arr[11] * v01) * det,
            (mat.arr[4] * v10 - mat.arr[5] * v08 + mat.arr[7] * v06) * det,
            (mat.arr[1] * v08 - mat.arr[0] * v10 - mat.arr[3] * v06) * det,
            (mat.arr[12] * v04 - mat.arr[13] * v02 + mat.arr[15] * v00) * det,
            (mat.arr[9] * v02 - mat.arr[8] * v04 - mat.arr[11] * v00) * det,
            (mat.arr[5] * v07 - mat.arr[4] * v09 - mat.arr[6] * v06) * det,
            (mat.arr[0] * v09 - mat.arr[1] * v07 + mat.arr[2] * v06) * det,
            (mat.arr[13] * v01 - mat.arr[12] * v03 - mat.arr[14] * v00) * det,
            (mat.arr[8] * v03 - mat.arr[9] * v01 + mat.arr[10] * v00) * det,
        ]);
    }

    static CreateRotation(angleX, angleY, angleZ, scale) {
        let xM = mat4.CreateIdentity();
        xM.arr[5] = Math.cos(angleX * scale);
        xM.arr[10] = Math.cos(angleX * scale);
        xM.arr[9] = -Math.sin(angleX * scale);
        xM.arr[6] = Math.sin(angleX * scale);

        let yM = mat4.CreateIdentity();
        yM.arr[0] = Math.cos(angleY * scale);
        yM.arr[10] = Math.cos(angleY * scale);
        yM.arr[2] = -Math.sin(angleY * scale);
        yM.arr[8] = Math.sin(angleY * scale);

        let zM = mat4.CreateIdentity();
        zM.arr[0] = Math.cos(angleZ * scale);
        zM.arr[5] = Math.cos(angleZ * scale);
        zM.arr[1] = -Math.sin(angleZ * scale);
        zM.arr[4] = Math.sin(angleZ * scale);

        let xyM = mat4.Multiply(xM, yM);
        let xyzM = mat4.Multiply(xyM, zM);
        return xyzM;
    }

    static CreateTranslation(x, y, z) {
        let M = mat4.CreateIdentity();
        M.arr[12] = x;
        M.arr[13] = y;
        M.arr[14] = z;
        return M;
    }

    static CreateScale(x, y, z) {
        let M = mat4.CreateIdentity();
        M.arr[0] = x;
        M.arr[5] = y;
        M.arr[10] = z;
        return M;
    }

    static CreateProjection(aspect, fov, near, far) {
        let M = mat4.CreateIdentity();
        M.arr[0] = 1.0 / (aspect * Math.tan(fov / 2.0));
        M.arr[5] = 1.0 / (Math.tan(fov / 2.0));
        M.arr[10] = -(far + near) / (far - near);
        M.arr[15] = 0.0;
        M.arr[11] = -1.0;
        M.arr[14] = -(2.0 * far + near) / (far - near);
        return M;
    }

    static CreateView(from, to, up) {
        let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;

        if (Math.abs(from.x - to.x) < 0.0001 && Math.abs(from.y - to.y) < 0.0001 && Math.abs(from.z - to.z) < 0.0001) {
            return mat4.CreateIdentity();
        }

        z0 = from.x - to.x;
        z1 = from.y - to.y;
        z2 = from.z - to.z;

        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        x0 = up.y * z2 - up.z * z1;
        x1 = up.z * z0 - up.x * z2;
        x2 = up.x * z1 - up.y * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        return new mat4([
            x0, y0, z0, 0,
            x1, y1, z1, 0,
            x2, y2, z2, 0,
            -(x0 * from.x + x1 * from.y + x2 * from.z), -(y0 * from.x + y1 * from.y + y2 * from.z), -(z0 * from.x + z1 * from.y + z2 * from.z), 1,
        ]);
    }

    static CreateNormal(m) {
        return new mat3([
            m.arr[0], m.arr[1], m.arr[2],
            m.arr[4], m.arr[5], m.arr[6],
            m.arr[8], m.arr[9], m.arr[10],
        ]);
    }
}