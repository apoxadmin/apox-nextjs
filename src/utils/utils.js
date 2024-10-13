export function uppercase(str) {
    return str.split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

export function sortById(a, b) {
    if (a.id < b.id) {
        return -1;
    } else if (a.id > b.id) {
        return 1;
    }
    return 0;
}

export function sortByField(a, b, field) {
    if (a[field] < b[field]) {
        return -1;
    } else if (a[field] > b[field]) {
        return 1;
    }
    return 0;
}

export function lerp(start, end, t) {
    if (t > 1) t = 1;
    if (t < 0) t = 0;
    return start + (end - start) * t;
}