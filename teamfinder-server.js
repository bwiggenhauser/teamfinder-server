const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 3333;
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
	cors: {
		origin: "*",
	},
});

const helpers = require("./helpers");
const playersClass = require("./players");
const teamFinderConfig = require("./teamfinder-config.json");
const spruchsammlung = require("./spruchsammlung.json");

// FREEZE OBJECTS -> CANT BE CHANGED
const imageLinks = Object.freeze(helpers.image_links);
const allPlayers = Object.freeze(teamFinderConfig.all_players);
const playerController = new playersClass.Players(allPlayers);

let configuration = getConfiguration(playerController.activePlayers);

let firstRoll = true;

function getSpruch(player) {
	if (!allPlayers.includes(player)) {
		return '"Auf Baggage kann jeder jeden von überall sehen."';
	}
	return helpers.getRandomElement(spruchsammlung[player]);
}

function getConfiguration() {
	const amount = 180;
	let config = [];

	for (let i = 0; i < amount; i++) {
		const selected = playerController.getRandomActivePlayer();
		config.push({
			name: selected,
			img: helpers.getRarity(helpers.randomValue(1, 12)),
			sentence: getSpruch(selected),
		});
	}
	return config;
}

io.on("connection", (socket) => {
	io.emit("all-players", playerController.allPlayers);
	io.emit("active-players", playerController.activePlayers);
	io.emit("all-players-temp", playerController.allTemporaryPlayers);
	io.emit("image-links", imageLinks);
	io.emit("configuration", configuration);
	io.emit("is-first-roll", firstRoll);

	socket.on("emit-roll", () => {
		// UPDATE ACTIVE PLAYERS
		playerController.togglePlayer(playerController.lastSelection);
		io.emit("active-players", playerController.activePlayers);

		playerController.setAllTemporaryPlayers();
		io.emit("all-players-temp", playerController.allTemporaryPlayers);

		// UPDATE CONFIGURATION
		configuration = getConfiguration(playerController.activePlayers);
		io.emit("configuration", configuration);

		const val = helpers.randomValue(22000, 25000);

		// 1500 -> CARDLIST WIDTH  /2 -> CENTER  150 -> CARD WIDTH
		playerController.lastSelection =
			configuration[Math.floor((val + 1500 / 2) / 155)].name;
		console.log(
			`Player ${playerController.lastSelection} has been selected.`
		);

		io.emit("is-first-roll", firstRoll);
		firstRoll = false;

		io.emit("roll", val);
	});

	// SPIELER WERDEN ZUM POOL HINZUGEFÜGT ODER ENTFERNT
	socket.on("update-player", (player) => {
		playerController.togglePlayer(player);
		io.emit("active-players", playerController.activePlayers);

		playerController.setAllTemporaryPlayers();
		io.emit("all-players-temp", playerController.allTemporaryPlayers);

		configuration = getConfiguration(playerController.activePlayers);
		io.emit("configuration", configuration);

		firstRoll = true;
		io.emit("is-first-roll", firstRoll);
	});

	// STANDARDEINSTELLUNGEN
	socket.on("reset", () => {
		playerController.resetActivePlayers();
		playerController.allTemporaryPlayers = playerController.allPlayers;

		io.emit("all-players-temp", playerController.allTemporaryPlayers);

		configuration = getConfiguration(playerController.activePlayers);
		firstRoll = true;
		console.log("Players have been reset.");
		io.emit("is-first-roll", firstRoll);
		io.emit("active-players", playerController.activePlayers);
		io.emit("configuration", configuration);
	});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
