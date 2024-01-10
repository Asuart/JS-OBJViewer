function ParseObj(objSource, upAxis = 2, forwardAxis = 0) {
    objSource = objSource.replace(/(\r)/gm, "");
    const lines = objSource.split("\n");

    let xIndex = 1 + (2 + upAxis) % 3;
    let yIndex = 1 + (0 + upAxis) % 3;
    let zIndex = 1 + (1 + upAxis) % 3;

    if (forwardAxis != 2) {
        let temp = xIndex;
        xIndex = zIndex;
        zIndex = temp;
    }

    let vertices = [];
    let texCoords = [];
    let normals = [];

    let currentMesh = new Mesh();

    let isEmptyString = (str) => {
        return str != "" && str != " " && str != "\n";
    }

    let parseFragment = (fragment) => {
        let vals = fragment.split("/");
        switch (vals.length) {
            case 1:
                currentMesh.vertices.push(new Vertex(vertices[parseInt(vals[0]) - 1].Clone()));
                break;
            case 2:
                currentMesh.vertices.push(new Vertex(vertices[parseInt(vals[0]) - 1].Clone(), new vec3(), texCoords[parseInt(vals[1]) - 1]));
                break;
            case 3:
                currentMesh.vertices.push(new Vertex(vertices[parseInt(vals[0]) - 1].Clone(), normals[parseInt(vals[2]) - 1], (vals[1] != "") ? texCoords[parseInt(vals[1]) - 1] : new vec2()));
                break;
            default:
                console.warn(`Fragment parsing error: "${fragment}"`);
        }
    }

    for (let i = 0; i < lines.length; i++) {
        if (!lines[i] || lines[i].length <= 1)
            continue;

        let tokens = lines[i].split(" ").filter(isEmptyString);

        switch (tokens[0]) {
            case "v": // vertex positions
                vertices.push(new vec3(parseFloat(tokens[xIndex]), parseFloat(tokens[yIndex]), parseFloat(tokens[zIndex])));
                break;
            case "vt": // vertex texture coords
                texCoords.push(new vec2(parseFloat(tokens[1]), parseFloat(tokens[2])));
                break;
            case "vn": // vertex normals
                normals.push(new vec3(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3])));
                break;
            case "f": // mesh fragment
                if (tokens.length == 4) { // triangle
                    if (forwardAxis != 2) {
                        parseFragment(tokens[1]);
                        parseFragment(tokens[3]);
                        parseFragment(tokens[2]);
                    } else {
                        parseFragment(tokens[1]);
                        parseFragment(tokens[2]);
                        parseFragment(tokens[3]);
                    }
                }
                else if (tokens.length == 5) { // quad
                    if (forwardAxis != 2) {
                        parseFragment(tokens[1]);
                        parseFragment(tokens[3]);
                        parseFragment(tokens[2]);
                        parseFragment(tokens[1]);
                        parseFragment(tokens[4]);
                        parseFragment(tokens[3]);
                    } else {
                        parseFragment(tokens[1]);
                        parseFragment(tokens[2]);
                        parseFragment(tokens[3]);
                        parseFragment(tokens[1]);
                        parseFragment(tokens[3]);
                        parseFragment(tokens[4]);
                    }
                }
                else { // any other shape
                    console.warn(`Unsopported polygon at line: ${i} ("${lines[i]}")`);
                }
                break;
            case "o": // new mesh
            case "usemtl": // used material
            case "mtllib": // load materials lib
            case "vp": // parameter vertex
            case "l": // line element
            case "#": // comment
            case "s": // smooth shading
            case "g": // group
                break;
            default:
                console.warn(`Unrecognized token at line: ${i} (${tokens[0]}) ("${lines[i]}")`);
                break;
        }
    }

    for (let i = 0; i < currentMesh.vertices.length; i++) {
        currentMesh.indices.push(i);
    }

    if (normals.length == 0) {
        currentMesh.RecalculateNormals();
    }

    return currentMesh;
}