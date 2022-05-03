const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 3001;
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

function getConfiguration() {
	const amount = 180;
	let config = [];

	for (let i = 0; i < amount; i++) {
		const selected = playerController.getRandomActivePlayer();
		config.push({
			name: selected,
			img: helpers.getRarity(helpers.randomValue(1, 12)),
			sentence: helpers.getRandomElement(["Spruch1", "Spruch2"]),
		});
	}
	return config;
}

io.on("connection", (socket) => {
	io.emit("all-players", playerController.allPlayers);
	io.emit("active-players", playerController.activePlayers);
	io.emit("image-links", imageLinks);
	io.emit("initial-configuration", configuration);
	io.emit("is-first-roll", firstRoll);

	socket.on("emit-roll", () => {
		// UPDATE ACTIVE PLAYERS
		playerController.togglePlayer(playerController.lastSelection);
		io.emit("active-players", playerController.activePlayers);

		// UPDATE CONFIGURATION
		configuration = getConfiguration(playerController.activePlayers);
		io.emit("configuration", configuration);

		const val = helpers.randomValue(22000, 25000);

		// 1500 -> CARDLIST WIDTH  /2 -> CENTER  150 -> CARD WIDTH
		playerController.lastSelection = configuration[Math.floor((val + 1500 / 2) / 160)].name;

		io.emit("is-first-roll", firstRoll);
		firstRoll = false;

		io.emit("roll", val);
	});

	// SPIELER WERDEN ZUM POOL HINZUGEFÜGT ODER ENTFERNT
	socket.on("update-player", (player) => {
		playerController.togglePlayer(player);
		io.emit("active-players", playerController.activePlayers);

		configuration = getConfiguration(playerController.activePlayers);
		io.emit("configuration", configuration);

		firstRoll = true;
		io.emit("is-first-roll", firstRoll);
	});

	// STANDARDEINSTELLUNGEN
	socket.on("reset", () => {
		playerController.resetActivePlayers();
		configuration = getConfiguration(playerController.activePlayers);
		firstRoll = true;

		io.emit("is-first-roll", firstRoll);
		io.emit("active-players", playerController.activePlayers);
		io.emit("configuration", configuration);
	});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
