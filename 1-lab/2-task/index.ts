const COMMONLY_USED_LETTERS = 'ETAOIN SHRDLU';

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

function calculateBestKeylengths(ciphertext: Buffer): Array<number> {
    let lowest: number = Infinity;
    const avgHammingDistanceByKeylength: Array<{ average: number, keylength: number }> = [];

    for (let keylength = 2; keylength <= 40; keylength++) {
        let toAverage = [];

        let start = 0;
        let end = start + keylength;

        while (true) {
            const firstChunk = ciphertext.slice(start, end);
            const secondChunk = ciphertext.slice(start + keylength, end + keylength);

            if (secondChunk.length < keylength)
                break;

            const distance: number = calculateHammingDistance(firstChunk, secondChunk);
            const normalizedDistance = distance / keylength;

            toAverage.push(normalizedDistance);

            start = end + keylength;
            end = start + keylength;
        }

        const average: number = toAverage.reduce((sum, x) => sum + x, 0) / toAverage.length;

        avgHammingDistanceByKeylength.push({ average, keylength });

        toAverage = [];
    }

    return avgHammingDistanceByKeylength
        .sort((a, b) => a.average - b.average)
        .map(x => x.keylength);
}

function transposeChunksByKeylength(keylength: number, ciphertext: Buffer): object {
    const chunks = {};
    let i = 0;

    ciphertext.forEach(char=> {
        if (i === keylength) i = 0;
        if (!chunks[i]) chunks[i] = [];

        chunks[i].push(char);

        i++;
    });

    return chunks;
}

function getKey(chunks: object): string {
    let key = '';

    Object
        .keys(chunks)
        .forEach(keyOffset => {
            let currentHighScore = -Infinity;
            let currentKeyChar = '';

            for (let i = 0; i <= 127; i++) {
                const xored = chunks[keyOffset].map(x => x ^ i);
                const str = Buffer.from(xored).toString();

                let score = 0;

                Array
                    .from(str.toUpperCase())
                    .forEach(char => {
                        if (COMMONLY_USED_LETTERS.includes(char)) score++;
                    });

                if (score > currentHighScore) {
                    currentHighScore = score;
                    currentKeyChar = String.fromCharCode(i);
                }
            }

            key += currentKeyChar;
        });

    return key;
}

function decrypt(bytes: Buffer, key: string): string {
    let i = 0;

    return bytes.reduce((plainText, byte) => {
        if (i === key.length) i = 0;

        const xor = byte ^ key[i].charCodeAt(0);

        plainText += String.fromCharCode(xor);
        i++

        return plainText;
    }, '');
}

(() => {
    const ciphertext     = '1c41023f564b2a130824570e6b47046b521f3f5208201318245e0e6b40022643072e13183e51183f5a1f3e4702245d4b285a1b23561965133f2413192e571e28564b3f5b0e6b50042643072e4b023f4a4b24554b3f5b0238130425564b3c564b3c5a0727131e38564b245d0732131e3b430e39500a38564b27561f3f5619381f4b385c4b3f5b0e6b580e32401b2a500e6b5a186b5c05274a4b79054a6b67046b540e3f131f235a186b5c052e13192254033f130a3e470426521f22500a275f126b4a043e131c225f076b431924510a295f126b5d0e2e574b3f5c4b3e400e6b400426564b385c193f13042d130c2e5d0e3f5a086b52072c5c192247032613433c5b02285b4b3c5c1920560f6b47032e13092e401f6b5f0a38474b32560a391a476b40022646072a470e2f130a255d0e2a5f0225544b24414b2c410a2f5a0e25474b2f56182856053f1d4b185619225c1e385f1267131c395a1f2e13023f13192254033f13052444476b4a043e131c225f076b5d0e2e574b22474b3f5c4b2f56082243032e414b3f5b0e6b5d0e33474b245d0e6b52186b440e275f456b710e2a414b225d4b265a052f1f4b3f5b0e395689cbaa186b5d046b401b2a500e381d4b23471f3b4051641c0f2450186554042454072e1d08245e442f5c083e5e0e2547442f1c5a0a64123c503e027e040c413428592406521a21420e184a2a32492072000228622e7f64467d512f0e7f0d1a';
    const ciphertextBuff = Buffer.from(ciphertext, 'hex');
    const bestKeylengths = calculateBestKeylengths(ciphertextBuff);

    // take top 5 best keylengths
    for (let i = 0; i < 5; i++) {
        const keylength     = bestKeylengths[i];
        const chunks        = transposeChunksByKeylength(keylength, ciphertextBuff);
        const key           = getKey(chunks);
        const decryptedText = decrypt(ciphertextBuff, key);

        console.log({ key, decryptedText });
    }
})();
