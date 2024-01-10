function SwapElements(arr, i, j) {
    let temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
}

function QSort(arr, comparator = function (a, b) { return a - b; }, start = undefined, end = undefined) {
    if (start == undefined) start = 0;
    if (end == undefined) end = arr.length - 1;

    let _start = start;
    let _end = end;
    let qIndex = start;
    let q = arr[qIndex];
    let center = Math.floor((start + end) / 2);

    for (; start < center; start++) {
        if (comparator(arr[start], q) > 0) {
            let untouch = true;
            for (; end > center; end--) {
                if (comparator(arr[end], q) < 0) {
                    SwapElements(arr, start, end);
                    untouch = false;
                    break;
                }
            }
            if (untouch) {
                if (start < (center - 1)) SwapElements(arr, center - 1, start);
                SwapElements(arr, center - 1, center);
                center--;
                start--;
            }
        }
    }
    for (; end > center; end--) {
        if (comparator(arr[end], q) < 0) {
            if (end > (center + 1)) SwapElements(arr, center + 1, end);
            SwapElements(arr, center + 1, center);
            center++;
            end++;
        }
    }
    if (comparator(arr[center], q) < 0) {
        if (qIndex < (center - 1)) SwapElements(arr, center - 1, qIndex);
        SwapElements(arr, center - 1, center);
        qIndex = center;
        center--;
    }

    if ((center - _start) > 1) MySort(arr, comparator, _start, center);
    else if (((center - _start) == 1) && (comparator(arr[_start], arr[center]) > 0)) SwapElements(arr, _start, center);
    if ((_end - center) > 1) MySort(arr, comparator, center, _end);
    else if (((_end - center) == 1) && (comparator(arr[center], arr[_end]) > 0)) SwapElements(arr, _end, center);
}