'use strict';

// uuid v4 has ultra small collision probability
const { v4: uuidv4 } = require('uuid');

const config       = require('./config');
const casinoApi    = require('./lib/api')(config.api.url);
const CasinoPlayer = require('./lib/CasinoPlayer');

async function crackCasinoRoyale() {
    const player = new CasinoPlayer(uuidv4(), casinoApi);

    await player.createAccount();
    await player.crackLcg();
}

crackCasinoRoyale();
