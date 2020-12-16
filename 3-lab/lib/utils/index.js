// expand mod formula
const mod = (a, b) => ((a % b) + b) % b;

const egcd = (a, b) => {
    if (a === 0) {
        return [ b, 0, 1 ];
    } else {
        const [ g, x, y ] = egcd(mod(b, a), a);

        return [ g, y - Math.floor(b / a) * x, x ];
    }
};

const modinv = (b, n) => {
    const [ g, x ] = egcd(b, n);

    if (g === 1) {
        return mod(x, n);
    }
};

const range = (start, end) => {
    const arr = [];

    for (let i = start; i <= end; i++) {
        arr.push(i);
    }

    return arr;
};

module.exports = {
    mod,
    egcd,
    modinv,
    range
};