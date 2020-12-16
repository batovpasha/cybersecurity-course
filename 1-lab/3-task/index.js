'use strict';

const TrigramScore    = require('./TrigramScore');
const englishTrigrams = require('./englishTrigrams.json');

const CIPHERTEXT = 'EFFPQLEKVTVPCPYFLMVHQLUEWCNVWFYGHYTCETHQEKLPVMSAKSPVPAPVYWMVHQLUSPQLYWLASLFVWPQLMVHQLUPLRPSQLULQESPBLWPCSVRVWFLHLWFLWPUEWFYOTCMQYSLWOYWYETHQEKLPVMSAKSPVPAPVYWHEPPLUWSGYULEMQTLPPLUGUYOLWDTVSQETHQEKLPVPVSMTLEUPQEPCYAMEWWYTYWDLUULTCYWPQLSEOLSVOHTLUYAPVWLYGDALSSVWDPQLNLCKCLRQEASPVILSLEUMQBQVMQCYAHUYKEKTCASLFPYFLMVHQLUPQLHULIVYASHEUEDUEHQBVTTPQLVWFLRYGMYVWMVFLWMLSPVTTBYUNESESADDLSPVYWCYAMEWPUCPYFVIVFLPQLOLSSEDLVWHEUPSKCPQLWAOKLUYGMQEUEMPLUSVWENLCEWFEHHTCGULXALWMCEWETCSVSPYLEMQYGPQLOMEWCYAGVWFEBECPYASLQVDQLUYUFLUGULXALWMCSPEPVSPVMSBVPQPQVSPCHLYGMVHQLUPQLWLRPOEDVMETBYUFBVTTPENLPYPQLWLRPTEKLWZYCKVPTCSTESQPQULLGYAUMEHVPETFWMEHVPETBZMEHVPETB';

let key            = 'ABCDEFGHIJKLMNOPQRSTUWVXYZ';
const cryptedWords = CIPHERTEXT.split(' ');
const cipher       = Array.from(new Set(CIPHERTEXT));
const trigramScore = new TrigramScore(englishTrigrams);

trigramScore.init();

function shuffle(str) {
    const index1  = Math.floor(Math.random() * str.length);
    const index2  = Math.floor(Math.random() * str.length);
    const value1 = key[index1];
    const value2 = key[index2];
    const chars  = Array.from(str);

    chars[index1] = value2;
    chars[index2] = value1;

    return chars.join('');
}

function score(key) {
    let points = 0;
    const decr = cipher.reduce((obj, letter, i) => {
        obj[letter] = key[i];

        return obj;
    }, {});

    for (const word of cryptedWords) {
        let decryptedWord = '';

        for (const letter of word) {
            decryptedWord += decr[letter] || '';
        }

        points += trigramScore.score(decryptedWord);
    }

    return points;
}

function decrypt(cipher, key, cryptedWords) {
    const decr = cipher.reduce((obj, letter, i) => {
        obj[letter] = key[i];

        return obj;
    }, {});

    const decryptedWords = [];

    for (const word of cryptedWords) {
        let decryptedWord = '';

        for (const letter of word) {
            decryptedWord += decr[letter] || '';
        }

        decryptedWords.push(decryptedWord);
    }

    return decryptedWords.join(' ');
}

(async () => {
    let points      = -Infinity;
    let maxPoints   =  points;
    let temperature = 1.0;
    let freezing    = 0.9997;

    while (true) {
        const newKey = shuffle(key);
        const currPoints = score(newKey);

        if (currPoints > points) {
            if (currPoints > maxPoints) {
                maxPoints = currPoints;

                console.log({
                    temperature,
                    currPoints,
                    key     : newKey,
                    decrypt : decrypt(cipher, newKey, cryptedWords)
                });
            }

            key = newKey;
            points = currPoints;
        } else {
            if (Math.random() < temperature) {
                points = currPoints;
                key = newKey;
            }

            temperature *= freezing;
        }
    }
})();
