function GetUntil(str, substr) {
    if (str.length == 0 || substr.length == 0) return str;
    let substrIndex = str.indexOf(substr);
    if (substrIndex == -1) return str;
    let s = str.substr(0, substrIndex);
    return s;
}

function RemoveUntil(str, substr) {
    if (str.length == 0 || substr.length == 0) return str;
    let substrIndex = str.indexOf(substr);
    if (substrIndex == -1) return str;
    return str.slice(substrIndex + substr.length, str.length);
}

function ParseObj(source) {
    let vertices = new Array();
    let indexes = new Array();
    var vCount = 0;
    var fCount = 0;

    while (true) {
        var endIndex = source.indexOf("\n");
        let isLastLine = false;
        if (endIndex == -1) {
            endIndex = source.length;
            isLastLine = true;
        }
        if (source.charAt(0) == 'v' && source.charAt(1) == ' ') {
            var str = source.substr(2, endIndex - 1);
            let v = [];
            for (let i = 0; i < 3; i++) {
                v[i] = GetUntil(str, ' ');
                str = RemoveUntil(str, ' ');
            }
            vertices[vCount++] = new vec3(parseFloat(v[0]), parseFloat(v[1]), parseFloat(v[2]));
        } else if (source.charAt(0) == 'f' && source.charAt(1) == ' ') {
            var str = source.substr(2, endIndex - 1);


            var v1 = GetUntil(str, ' ');
            str = RemoveUntil(str, ' ');
            var v2 = GetUntil(str, ' ');
            str = RemoveUntil(str, ' ');
            var v3 = GetUntil(str, ' ');
            str = RemoveUntil(str, ' ');

            v1 = GetUntil(v1, "/");
            v2 = GetUntil(v2, "/");
            v3 = GetUntil(v3, "/");

            indexes[fCount * 3] = parseInt(v1, 10) - 1;
            indexes[fCount * 3 + 1] = parseInt(v2, 10) - 1;
            indexes[fCount * 3 + 2] = parseInt(v3, 10) - 1;
            fCount++;
        }
        if (isLastLine) {
            break;
        } else {
            source = source.slice(endIndex + 1, source.length);
        }
    }
    return { vertices: vertices, indexes: indexes };
}