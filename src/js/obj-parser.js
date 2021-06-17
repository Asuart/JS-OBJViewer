function ParseObj(source) {
    let vertices = [];
    let indexes = [];

    let strings = source.split("\n");
    for(let stringIndex = 0; stringIndex < strings.length; stringIndex++){
        let tokens = strings[stringIndex].split(" ");
        if (tokens[0] == "v") vertices[vertices.length] = new vec3(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
        else if (tokens[0] == "f") {
            if (tokens.length == 4) {
                for(let i = 1; i < 4; i++)indexes[indexes.length] = parseInt(tokens[i].split("/")[0], 10) - 1;
            } else if (tokens.length == 5) {
                for(let i = 1; i < tokens.length; i++) indexes[indexes.length] = parseInt(tokens[i].split("/")[0], 10) - 1;
                indexes[indexes.length] = indexes[indexes.length - 4];
                indexes[indexes.length] = indexes[indexes.length - 3];
            } else console.error("Obj parsing error. Unhandled vertices count per patch: " + vertCount);
        }
    }

    return { vertices: vertices, indexes: indexes };
}