const helpers = require("./helpers");

class Players {
	constructor(allPlayers) {
		this.allPlayers = allPlayers;
		this.activePlayers = allPlayers;
        this.lastSelection  = "";
	}

	resetActivePlayers() {
		this.activePlayers = this.allPlayers;
	}

	getRandomActivePlayer() {
		return helpers.getRandomElement(this.activePlayers);
	}

	togglePlayer(player) {
		if (player === "" || player === undefined) {
			return;
		}

		if (!this.activePlayers.includes(player)) {
			this.activePlayers.push(player);
			return;
		}

		if (this.activePlayers.length < 2) {
			return;
		}

		const index = this.activePlayers.indexOf(player);
		let spliced = [...this.activePlayers];
		spliced.splice(index, 1);
		this.activePlayers = spliced;
	}
}

module.exports = {
	Players,
};
