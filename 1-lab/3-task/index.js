'use strict';

const TrigramScore    = require('./TrigramScore');
const englishTrigrams = require('./englishTrigrams.json');

const TRIGRAMS_FILE_PATH = './english_trigrams.txt';
const CIPHERTEXT         = 'EFFPQLEKVTVPCPYFLMVHQLUEWCNVWFYGHYTCETHQEKLPVMSAKSPVPAPVYWMVHQLUSPQLYWLASLFVWPQLMVHQLUPLRPSQLULQESPBLWPCSVRVWFLHLWFLWPUEWFYOTCMQYSLWOYWYETHQEKLPVMSAKSPVPAPVYWHEPPLUWSGYULEMQTLPPLUGUYOLWDTVSQETHQEKLPVPVSMTLEUPQEPCYAMEWWYTYWDLUULTCYWPQLSEOLSVOHTLUYAPVWLYGDALSSVWDPQLNLCKCLRQEASPVILSLEUMQBQVMQCYAHUYKEKTCASLFPYFLMVHQLUPQLHULIVYASHEUEDUEHQBVTTPQLVWFLRYGMYVWMVFLWMLSPVTTBYUNESESADDLSPVYWCYAMEWPUCPYFVIVFLPQLOLSSEDLVWHEUPSKCPQLWAOKLUYGMQEUEMPLUSVWENLCEWFEHHTCGULXALWMCEWETCSVSPYLEMQYGPQLOMEWCYAGVWFEBECPYASLQVDQLUYUFLUGULXALWMCSPEPVSPVMSBVPQPQVSPCHLYGMVHQLUPQLWLRPOEDVMETBYUFBVTTPENLPYPQLWLRPTEKLWZYCKVPTCSTESQPQULLGYAUMEHVPETFWMEHVPETBZMEHVPETB';

let key            = 'ABCDEFGHIJKLMNOPQRSTUWVXYZ';
const cryptedWords = CIPHERTEXT.split(' ');
const cipher       = Array.from(new Set(CIPHERTEXT));
const trigramScore = new TrigramScore(englishTrigrams);

trigramScore.init();

function shuffle(key) {
    const a  = Math.floor(Math.random() * key.length);
    const b  = Math.floor(Math.random() * key.length);
    const aV = key[a];
    const bV = key[b];
    const aM = Array.from(key);

    aM[a] = bV;
    aM[b] = aV;

    return aM.join('');
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
    let points      = -1000000;
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
