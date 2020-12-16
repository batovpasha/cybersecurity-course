class CasinoPlayer {
    constructor(id, casinoApi) {
        this.id = id;
        this.casinoApi = casinoApi;
        this.money = 0;
    }

    async createAccout() {
        const { money } = await this.casinoApi.createAccount(this.id);

        this.money += money;
    }
}

module.exports = CasinoPlayer;