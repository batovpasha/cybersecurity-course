class TrigramScore {
    constructor(trigramsText) {
        this.trigramsText = trigramsText;
        this.trigrams     = {};
        this.lettersCount = 3;
    }

    init() {
        this.trigramsText
            .split('\n')
            .forEach(line => {
                const [ key, count ] = line.split(' ');

                this.trigrams[key] = parseInt(count);
            });

        this.totalNumber = Object.values(this.trigrams).reduce((a, b) => a + b, 0);

        Object
            .keys(this.trigrams)
            .forEach(key => {
               this.trigrams[key] = Math.log10(parseFloat(this.trigrams[key]) / this.totalNumber);
            });

        this.floor = Math.log10(0.01 / this.totalNumber);
    }

    score(text) {
        let score = 0;

        for (let i = 0; i < text.length - this.lettersCount + 1; i++) {
            const trigram = text.slice(i, i + this.lettersCount).toUpperCase();

            if (this.trigrams.hasOwnProperty(trigram)) {
                score += this.trigrams[trigram];
            } else {
                score += this.floor;
            }
        }
    }
}

module.exports = TrigramScore;
