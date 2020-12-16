const fetch = require('node-fetch');

const api = (url) => {
    const createAccount = async playerId => {
        const route = '/createacc';
        const response = await fetch(`${url}${route}?id=${playerId}`);
        const body = await response.json();

        return body;
    };

    return {
        createAccount
    };
};

module.exports = api;