class Lcg {
    constructor({ seed, multiplier, increment, modulus }) {
        this.state = BigInt(seed);
        this.multiplier = BigInt(multiplier);
        this.increment = BigInt(increment);
        this.modulus = modulus;
    }
}

module.exports = Lcg;