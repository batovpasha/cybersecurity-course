class MersenneTwister {
    static N = 624;
    static M = 397;
    static A = 0x9908B0DF;
    static U = 11;
    static S = 7;
    static B = 0x9D2C5680;
    static T = 15;
    static C = 0xEFC60000;
    static L = 18;
    static F = 1812433253;
    static D = 0xFFFFFFFF;

    index = 0;
    state = [];

    constructor(seed = 0) {
        this.state[0] = MersenneTwister._int32(seed);

        for (let i = 1; i < MersenneTwister.N; ++i) {
            const x = this.state[i - 1] ^ (this.state[i - 1] >>> 30);
            this.state[i] = MersenneTwister._int32(
                ((((x & 0xffff0000) >>> 16) * MersenneTwister.F) << 16) +
                ((((x & 0x0000ffff) >>>  0) * MersenneTwister.F) <<  0) +
                i
            );
        }
    }

    static temper(x) {
        x ^= (x >>> MersenneTwister.U & MersenneTwister.D);
        x ^= (x << MersenneTwister.S) & MersenneTwister.B;
        x ^= (x << MersenneTwister.T) & MersenneTwister.C;
        x ^= (x >>> MersenneTwister.L);

        return MersenneTwister._int32(x);
    }

    // https://shainer.github.io/crypto/python/matasano/random/2016/10/27/mersenne-twister-p2.html
    static untemper(x) {
        x ^= (x >>> MersenneTwister.L);
        x ^= ((x << MersenneTwister.T) & MersenneTwister.C);

        const a = x << 7
        const b = x ^ (a & MersenneTwister.B)
        const c = b << 7
        const d = x ^ (c & MersenneTwister.B)
        const e = d << 7
        const f = x ^ (e & MersenneTwister.B)
        const g = f << 7
        const h = x ^ (g & MersenneTwister.B)
        const i = h << 7
        x = x ^ (i & MersenneTwister.B)

        const z = x >>> MersenneTwister.U;
        const y = x ^ z;
        const s = y >>> MersenneTwister.U;
        x ^= s;

        return MersenneTwister._int32(x);
    }

    static from(state) {
        const mt = new MersenneTwister();
        mt.state = state.map(MersenneTwister.untemper);

        return mt;
    }

    static _int32(x) {
        return new Uint32Array([x])[0];
    }

    [Symbol.iterator]() {
        return {
            next : () => {
                if (this.index === 0) {
                    for (let i = 0; i < MersenneTwister.N; i++) {
                        const x = MersenneTwister._int32(
                            (this.state[i] & (1 << 31)) +
                            (this.state[(i + 1) % MersenneTwister.N] & ((1 << 31) - 1))
                        );
                        this.state[i] =
                            (this.state[(i + MersenneTwister.M) % MersenneTwister.N] ^ x >>> 1);
                        this.state[i] = MersenneTwister._int32(
                            (x & 1)
                                ? (this.state[i] ^ MersenneTwister.A)
                                : this.state[i]
                        );
                    }
                }

                const value = MersenneTwister.temper(this.state[this.index]);
                this.index = (this.index + 1) % MersenneTwister.N;

                return value;
            }
        };
    }
}

module.exports = MersenneTwister;
