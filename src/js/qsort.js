function SwapElements(arr, i, j) {
    let temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
}

function SwapElementDouble(arr, swapArr, i, j) {
    SwapElements(arr, i, j);
    SwapElements(swapArr, i, j)
}

function q_sort_associative(arr, swapArr, start, end) {
    if (arr.length != swapArr.length) {
        console.error("Arrays are different in size!");
        return;
    }
    if (start == undefined) start = 0;
    if (end == undefined) end = arr.length - 1;

    let _start = start;
    let _end = end;
    let qIndex = start;
    let q = arr[qIndex];
    let center = Math.floor((start + end) / 2);

    for (; start < center; start++) {
        if (arr[start] > q) {
            let untouch = true;
            for (; end > center; end--) {
                if (arr[end] < q) {
                    SwapElementDouble(arr, swapArr, start, end);
                    untouch = false;
                    break;
                }
            }
            if (untouch) {
                if (start < (center - 1)) SwapElementDouble(arr, swapArr, center - 1, start);
                SwapElementDouble(arr, swapArr, center - 1, center);
                center--;
                start--;
            }
        }
    }
    for (; end > center; end--) {
        if (arr[end] < q) {
            if (end > (center + 1)) SwapElementDouble(arr, swapArr, center + 1, end);
            SwapElementDouble(arr, swapArr, center + 1, center);
            center++;
            end++;
        }
    }
    if (arr[center] < q) {
        if (qIndex < (center - 1)) SwapElementDouble(arr, swapArr, center - 1, qIndex);
        SwapElementDouble(arr, swapArr, center - 1, center);
        qIndex = center;
        center--;
    }

    if ((center - _start) > 1) q_sort_associative(arr, swapArr, _start, center);
    else if (((center - _start) == 1) && (arr[_start] > arr[center])) SwapElementDouble(arr, swapArr, _start, center);
    if ((_end - center) > 1) q_sort_associative(arr, swapArr, center, _end);
    else if (((_end - center) == 1) && (arr[center] > arr[_end])) SwapElementDouble(arr, swapArr, _end, center);
}