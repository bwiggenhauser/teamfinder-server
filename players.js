const helpers = require("./helpers");

class Players {
	constructor(allPlayers) {
		this.allPlayers = allPlayers;
		this.activePlayers = allPlayers;
		this.allTemporaryPlayers = [];
		this.lastSelection = "";
		this.setAllTemporaryPlayers();
	}

	setAllTemporaryPlayers() {
		let c = this.allPlayers.concat(this.activePlayers);
		let d = c.filter((item, pos) => c.indexOf(item) === pos);
		this.allTemporaryPlayers = d;
	}

	resetActivePlayers() {
		this.activePlayers = this.allPlayers;
        this.lastSelection = "";
		this.setAllTemporaryPlayers();
	}

	getRandomActivePlayer() {
		return helpers.getRandomElement(this.activePlayers);
	}

	togglePlayer(player) {
		if (player === "" || player === undefined) {
			return;
		}

		if (!this.activePlayers.includes(player)) {
			let newActive = [...this.activePlayers];
			newActive.push(player);
			this.activePlayers = newActive;
			this.setAllTemporaryPlayers();
			return;
		}

		if (this.activePlayers.length < 2) {
			return;
		}

		const index = this.activePlayers.indexOf(player);
		let spliced = [...this.activePlayers];
		spliced.splice(index, 1);
		this.activePlayers = spliced;
		this.setAllTemporaryPlayers();
	}
}

module.exports = {
	Players,
};
