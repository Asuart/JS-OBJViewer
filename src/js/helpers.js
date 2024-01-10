function ToDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
}

function LoadFile(url, callback, ...args) {
    const xhr = new XMLHttpRequest();
    xhr.callback = callback;
    xhr.arguments = args;
    xhr.onload = function () { this.callback(this, this.arguments); }
    xhr.onerror = function () { console.error(this.statusText) };
    xhr.open("GET", url);
    xhr.send();
}

function OpenFile(callback = content => { }) {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = (readerEvent) => callback(readerEvent.target.result);
    }
    input.click();
}

function SaveFile(text, name, type) {
    var a = CreateElement("a");
    var file = new Blob([text], { type: type });
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

function SaveImageSource(dataURL) {
    let downloadLink = CreateElement("a");
    downloadLink.setAttribute("download", "CanvasAsImage.png");
    downloadLink.setAttribute("href", dataURL);
    downloadLink.click();
    downloadLink.remove();
}

function SaveCanvasAsPNG(canvas) {
    let dataURL = canvas.toDataURL("image/png");
    SaveImageSource(dataURL);
}

function HexToRGB(color) {
    color = color.substr(1, 6);
    let r = color.substr(0, 2);
    let g = color.substr(2, 2);
    let b = color.substr(4, 2);
    return new vec3(parseInt(r, 16) / 255.0, parseInt(g, 16) / 255.0, parseInt(b, 16) / 255.0);
}

function RGBToHex(color) {
    let r = Math.floor(color.r * 255).toString(16);
    let g = Math.floor(color.g * 255).toString(16);
    let b = Math.floor(color.b * 255).toString(16);
    if (r.length < 2) r = "0" + r;
    if (g.length < 2) g = "0" + g;
    if (b.length < 2) b = "0" + b;
    return "#" + r + g + b;
}

function GetUniqueColor(index) {
    let h = (index * 137.508) % 160;
    let s = 0.5;
    let l = 0.75;

    let C = (1 - Math.abs(2 * l - 1)) / s;
    let X = C * (1 - Math.abs((h / 60) % 2 - 1));
    m = l - C * 0.5;

    let r_, g_, b_;
    switch (Math.floor(h / 60)) {
        case 0:
            r_ = C; g_ = X; b = 0;
            break;
        case 1:
            r_ = X; g_ = C; b = 0;
            break;
        case 2:
            r_ = 0; g_ = C; b = X;
            break;
        case 3:
            r_ = 0; g_ = X; b = C;
            break;
        case 4:
            r_ = X; g_ = 0; b = C;
            break;
        case 5:
            r_ = C; g_ = 0; b = X;
            break;
    }

    return new vec3(Clamp(r_ + m, 0, 1), Clamp(g_ + m, 0, 1), Clamp(b_ + m, 0, 1));
};

function CreateElement(type, classList = "", content) {
    let element = document.createElement(type);
    if (classList) element.classList.add(...classList.split(" ").filter((el) => el != ""));
    if (content) element.innerHTML = content;
    return element;
}

function CreateCanvas(classList, width, height) {
    let canvas = CreateElement('canvas', classList);
    canvas.width = width;
    canvas.height = height;
    return canvas;
};

function SerializeArray(arr, func = (el) => JSON.stringify(el)) {
    let str = "";
    for (let i = 0; i < arr.length; i++) {
        str += func(arr[i]) + (i != arr.length - 1 ? "," : "");
    }
    return "[" + str + "]";
};

function ImageToPixels(image) {
    let canvas = CreateCanvas("", image.width, image.height);
    let context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    return context.getImageData(0, 0, image.width, image.height);
}