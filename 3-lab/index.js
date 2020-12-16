'use strict';

// uuid v4 has ultra small collision probability
const { v4: uuidv4 } = require('uuid');

const casinoApi    = require('./lib/api');
const CasinoPlayer = require('./lib/CasinoPlayer');

async function crackCasinoRoyale() {
    const player = new CasinoPlayer(uuidv4(), casinoApi);
    console.log(player);
}

crackCasinoRoyale();
