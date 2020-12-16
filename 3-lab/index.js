'use strict';

// uuid v4 has ultra small collision probability
const { v4: uuidv4 } = require('uuid');

const config       = require('./config');
const casinoApi    = require('./lib/api')(config.api.url);
const CasinoPlayer = require('./lib/CasinoPlayer');

async function crackCasinoRoyale() {
    // const player1 = new CasinoPlayer(uuidv4(), casinoApi);
    //
    // await player1.createAccount();
    // await player1.crackLcg();

    // const player2 = new CasinoPlayer(uuidv4(), casinoApi);
    //
    // await player2.createAccount();
    // await player2.crackMt();

    const player3 = new CasinoPlayer(uuidv4(), casinoApi);

    await player3.createAccount();
    await player3.crackBetterMt();
}

crackCasinoRoyale();
