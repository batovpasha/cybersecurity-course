const { mod, modinv } = require('../utils');

class Lcg {
    constructor({ seed, multiplier, increment, modulus }) {
        this.state = BigInt(seed);
        this.multiplier = BigInt(multiplier);
        this.increment = BigInt(increment);
        this.modulus = modulus;
    }

    static crackUnknownMultiplier(states, modulus) {
        return parseInt(
            mod(
                BigInt(states[2] - states[1]) * BigInt(modinv(states[1] - states[0], modulus)),
                BigInt(modulus)
            )
        );
    }

    static crackUnknownIncrement(states, modulus, multiplier) {
        return mod(states[1] - states[0] * multiplier, modulus);
    }

    [Symbol.iterator]() {
        return {
            next : () => {
                this.state = mod((this.state * this.multiplier + this.increment), this.modulus);

                return {
                    value : this.state,
                    done  : false // infinity iterator
                };
            }
        }
    }
}

module.exports = Lcg;