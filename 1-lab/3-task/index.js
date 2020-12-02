'use strict';

const { readFile } = require('fs/promises');

const TrigramScore = require('./TrigramScore');

const TRIGRAMS_FILE_PATH = './english_trigrams.txt';

const CIPHERTEXT = 'EFFPQLEKVTVPCPYFLMVHQLUEWCNVWFYGHYTCETHQEKLPVMSAKSPVPAPVYWMVHQLUSPQLYWLASLFVWPQLMVHQLUPLRPSQLULQESPBLWPCSVRVWFLHLWFLWPUEWFYOTCMQYSLWOYWYETHQEKLPVMSAKSPVPAPVYWHEPPLUWSGYULEMQTLPPLUGUYOLWDTVSQETHQEKLPVPVSMTLEUPQEPCYAMEWWYTYWDLUULTCYWPQLSEOLSVOHTLUYAPVWLYGDALSSVWDPQLNLCKCLRQEASPVILSLEUMQBQVMQCYAHUYKEKTCASLFPYFLMVHQLUPQLHULIVYASHEUEDUEHQBVTTPQLVWFLRYGMYVWMVFLWMLSPVTTBYUNESESADDLSPVYWCYAMEWPUCPYFVIVFLPQLOLSSEDLVWHEUPSKCPQLWAOKLUYGMQEUEMPLUSVWENLCEWFEHHTCGULXALWMCEWETCSVSPYLEMQYGPQLOMEWCYAGVWFEBECPYASLQVDQLUYUFLUGULXALWMCSPEPVSPVMSBVPQPQVSPCHLYGMVHQLUPQLWLRPOEDVMETBYUFBVTTPENLPYPQLWLRPTEKLWZYCKVPTCSTESQPQULLGYAUMEHVPETFWMEHVPETBZMEHVPETB';
const KEY        = 'ABCDEFGHIJKLMNOPQRSTUWVXYZ';

const cryptedWords = CIPHERTEXT.split(' ');

const cipher = Array.from(new Set(CIPHERTEXT));

console.log({cipher});

function shuffle(key) {
    const a  = Math.floor(Math.random() * key.length);
    const b  = Math.floor(Math.random() * key.length);
    const aV = key[a];
    const bV = key[b];
    const aM = Array.from(key);

    aM[a] = bV;
    aM[b] = aV;

    return aM.join();
}

(async () => {
    const trigramText = await readFile(TRIGRAMS_FILE_PATH, { encoding: 'utf-8' });
    const trigramScore = new TrigramScore(trigramText);

    trigramScore.init();

    let points    = -1000000;
    let maxPoints =  points;
    let t         = 1.0;
    let freezing  = 0.9997;

    while (true) {
        let newKey = shuffle(KEY);

        // TODO: implement core logic
    }
})();
