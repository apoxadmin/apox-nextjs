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
