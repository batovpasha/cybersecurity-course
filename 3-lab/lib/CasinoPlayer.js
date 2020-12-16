const { modinv, range } = require('./utils');
const Lcg               = require('./prngs/Lcg');
const MersenneTwister   = require('./prngs/MersenneTwister');

class CasinoPlayer {
    constructor(id, casinoApi, earningsThreshold  = 1000000) {
        this.id = id;
        this.casinoApi = casinoApi;
        this.money = 0;
        this.earningsThreshold = earningsThreshold;
    }

    async createAccount() {
        const { money } = await this.casinoApi.createAccount(this.id);

        this.money += money;
    }

    async crackLcg() {
        const {
            seed,
            multiplier,
            increment,
            modulus
        } = await this._crackLcgParams();

        const lcg = new Lcg({ seed, multiplier, increment, modulus });

        for (const nextValue of lcg) {
            const data = await this.casinoApi.makeBetAndPlayLcg(this.id, 10, nextValue);

            this.money += data.account.money;

            console.log({ data });

            if (this.money >= this.earningsThreshold) {
                console.log(`Successfully earned ${this.earningsThreshold} money`);

                break;
            }
        }
    }

    async _crackLcgParams() {
        const modulus = 2 ** 32;
        let multiplier = null;
        let increment = null;
        let states = [];

        while (multiplier === null || increment === null) {
            const firstState = await this.casinoApi.makeBetAndPlayLcg(this.id, 10, 10);
            const secondState = await this.casinoApi.makeBetAndPlayLcg(this.id, 10, 10);

            states = [ firstState.realNumber, secondState.realNumber ];

            if (modinv(states[1] - states[0], modulus) !== undefined) {
                const thirdState = await this.casinoApi.makeBetAndPlayLcg(this.id, 10, 10);

                states.push(thirdState.realNumber);
                multiplier = Lcg.crackUnknownMultiplier(states, modulus);
                increment = Lcg.crackUnknownIncrement(states, modulus, multiplier);
            } else {
                states = [];
            }
        }

        return {
            seed : states[states.length - 1],
            multiplier,
            increment,
            modulus
        };
    }

    async crackMt() {
        const startTimestamp = Date.now();
        const initState = await this.casinoApi.makeBetAndPlayMt(this.id, 10, 0);
        const finishTimestamp = Date.now();

        const timestampRange = range(startTimestamp / 1000, finishTimestamp / 1000);

        for (const timestamp of timestampRange) {
            const mt = new MersenneTwister(timestamp);
            const generatedInitState = mt.next().value;

            if (generatedInitState === initState.realNumber) {
                for (const nextValue of mt) {
                    const data = await this.casinoApi.makeBetAndPlayMt(this.id, 10, nextValue);

                    this.money += data.account.money;

                    console.log({ data });

                    if (this.money >= this.earningsThreshold) {
                        console.log(`Successfully earned ${this.earningsThreshold} money`);

                        break;
                    }
                }
            }
        }
    }
}

module.exports = CasinoPlayer;