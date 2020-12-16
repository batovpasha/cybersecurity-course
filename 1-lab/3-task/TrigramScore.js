class TrigramScore {
    constructor(trigrams) {
        this.trigrams     = trigrams;
        this.lettersCount = 3;
    }

    async init() {
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

            score += this.trigrams.hasOwnProperty(trigram) ? this.trigrams[trigram] : this.floor;
        }

        return score;
    }
}

module.exports = TrigramScore;
