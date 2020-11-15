function calculateHammingDistance(buff1: Buffer, buff2: Buffer): number {
    if (buff1.length !== buff2.length) throw new Error('Buffers lengths must be equal');

    return buff1.reduce((totalDistance, byte1, i) => {
        const byte2 = buff2[i];
        let xored = byte1 ^ byte2;

        let setBits = 0; // total number of "1" in xor result number

        while (xored > 0) {
            setBits += xored & 1;
            xored >>= 1;
        }

        totalDistance += setBits;

        return totalDistance;
    }, 0);
}
