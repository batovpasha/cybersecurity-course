const fetch = require('node-fetch');

const api = (url) => {
    const createAccount = async playerId => {
        const route = '/createacc';
        const response = await fetch(`${url}${route}?id=${playerId}`);
        const body = await response.json();

        return body;
    };

    const makeBetAndPlay = mode => async (playerId, bet, number) => {
        const route = `/play${mode}`;
        const response = await fetch(`${url}${route}?id=${playerId}&bet=${bet}&number=${number}`);
        const body = await response.json();

        return body;
    };

    return {
        createAccount,
        makeBetAndPlayLcg      : makeBetAndPlay('Lcg'),
        makeBetAndPlayMt       : makeBetAndPlay('Mt'),
        makeBetAndPlayBetterMt : makeBetAndPlay('BetterMt')
    };
};

module.exports = api;