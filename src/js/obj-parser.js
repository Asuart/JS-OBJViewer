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
            var spaceIndex = str.indexOf(' ');
            var v1 = str.substr(0, spaceIndex);
            str = str.slice(spaceIndex + 1, str.length);
            spaceIndex = str.indexOf(' ');
            var v2 = str.substr(0, spaceIndex);
            str = str.slice(spaceIndex + 1, str.length);
            var v3 = str;

            vertices[vCount++] = new vec3(+(v1), +(v2), +(v3));
        } else if (source.charAt(0) == 'f' && source.charAt(1) == ' ') {
            var str = source.substr(2, endIndex - 1);
            var spaceIndex = str.indexOf(' ');
            var v1 = str.substr(0, spaceIndex);
            str = str.slice(spaceIndex + 1, str.length);
            spaceIndex = str.indexOf(' ');
            var v2 = str.substr(0, spaceIndex);
            str = str.slice(spaceIndex + 1, str.length);
            var v3 = str;


            var slashIndex = v1.indexOf("/");
            if (slashIndex != -1) v1 = v1.substr(0, slashIndex);
            slashIndex = v2.indexOf("/");
            if (slashIndex != -1) v2 = v2.substr(0, slashIndex);
            slashIndex = v3.indexOf("/");
            if (slashIndex != -1) v3 = v3.substr(0, slashIndex);

            indexes[fCount * 3] = (+(v1)) - 1;
            indexes[fCount * 3 + 1] = (+(v2)) - 1;
            indexes[fCount * 3 + 2] = (+(v3)) - 1;
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