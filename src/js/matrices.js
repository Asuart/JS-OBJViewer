// requires vec3.js

function CreateOneMatrix() {
    let M = [];
    M[0] = [];
    M[1] = [];
    M[2] = [];
    M[3] = [];

    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++) {
            if (i == j) M[i][j] = 1;
            else M[i][j] = 0;
        }
    return M;
}

function CreateRotationMatrix(angleX, angleY, angleZ, scale) {
    let xM = CreateOneMatrix();
    xM[1][1] = Math.cos(angleX * scale);
    xM[2][2] = Math.cos(angleX * scale);
    xM[1][2] = Math.sin(angleX * scale);
    xM[2][1] = -Math.sin(angleX * scale);

    let yM = CreateOneMatrix();
    yM[0][0] = Math.cos(angleY * scale);
    yM[2][2] = Math.cos(angleY * scale);
    yM[2][0] = Math.sin(angleY * scale);
    yM[0][2] = -Math.sin(angleY * scale);

    let zM = CreateOneMatrix();
    zM[0][0] = Math.cos(angleZ * scale);
    zM[1][1] = Math.cos(angleZ * scale);
    zM[1][0] = -Math.sin(angleZ * scale);
    zM[0][1] = Math.sin(angleZ * scale);

    let xyM = MultMatrix(xM, yM);
    let xyzM = MultMatrix(xyM, zM);
    return xyzM;
}

function CreaeteTranslationMatrix(x, y, z) {
    let M = CreateOneMatrix();
    M[0][3] = x;
    M[1][3] = y;
    M[2][3] = z;
    return M;
}

function CreateScaleMatrix(x, y, z) {
    let M = CreateOneMatrix();
    M[0][0] = x;
    M[1][1] = y;
    M[2][2] = z;
    return M;
}

function CreateProjectionMatrix(fovRadians, aspect, near, far) {
    f = Math.tan(Math.PI * 0.5 - 0.5 * fovRadians);
    rangeInv = 1.0 / (near - far);

    let M = [
        [f / aspect, 0, 0, 0],
        [0, f, 0, 0],
        [0, 0, (near + far) * rangeInv, -1],
        [0, 0, near * far * rangeInv * 2, 0]
    ];
    return M;
}

function CreateViewMatrix(right, up, forward, pos) {
    let M = CreateOneMatrix();

    M[0][0] = right.x;
    M[1][0] = right.y;
    M[2][0] = right.z;
    M[3][0] = 0;

    M[0][1] = up.x;
    M[1][1] = up.y;
    M[2][1] = up.z;
    M[3][1] = 0;

    M[0][2] = forward.x;
    M[1][2] = forward.y;
    M[2][2] = forward.z;
    M[3][2] = 0;

    M[0][3] = pos.x;
    M[1][3] = pos.y;
    M[2][3] = pos.z;
    M[3][3] = 1;

    return M;
}

function multPointMatrix(inP, M) {
    let out = new vec3(0, 0, 0);
    out.x = inP.x * M[0][0] + inP.y * M[0][1] + inP.z * M[0][2] + M[0][3];
    out.y = inP.x * M[1][0] + inP.y * M[1][1] + inP.z * M[1][2] + M[1][3];
    out.z = inP.x * M[2][0] + inP.y * M[2][1] + inP.z * M[2][2] + M[2][3];
    let w = inP.x * M[3][0] + inP.y * M[3][1] + inP.z * M[3][2] + M[3][3];

    //(convert from homogeneous to Cartesian coordinates)
    out.x /= w;
    out.y /= w;
    out.z /= w;

    return out;
}

function MultMatrix(m1, m2) {
    var M = [];
    for (var i = 0; i < 4; i++) M[i] = [];

    for (var k = 0; k < 4; k++)
        for (var i = 0, temp = 0; i < 4; i++, temp = 0) {
            for (var j = 0; j < 4; j++) temp += m1[i][j] * m2[j][k];
            M[i][k] = temp;
        }
    return M;
}