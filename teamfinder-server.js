const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 3001;
// const index = require("./routes/index");

const app = express();
// app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
	cors: {
		origin: "*",
	},
});

const helpers = require("./helpers");
const teamFinderConfig = require("./teamfinder-config.json");
let spruchsammlung = require("./spruchsammlung.json");

// FREEZE OBJECTS -> CANT BE CHANGED
const imageLinks = Object.freeze(helpers.image_links);
const allPlayers = Object.freeze(teamFinderConfig.all_players);

let activePlayers = [...allPlayers];
let lastSelection = "";
let firstRoll = true;

let configuration = getConfiguration();

function getConfiguration() {
	const amount = 180;
	let config = [];

	for (let i = 0; i < amount; i++) {
		let new_player = {};
		new_player["name"] = helpers.getRandomElement(activePlayers);
		new_player["img"] = helpers.getRarity(helpers.randomValue(1, 12));
		new_player["sentence"] = helpers.getRandomElement(
			spruchsammlung[new_player["name"]]
		);
		config.push(new_player);
	}
	return config;
}

// Add or Remove player from active players
function updatePlayers(player) {
	activePlayers = [...activePlayers];
	if (!activePlayers.includes(player)) {
		activePlayers.push(player);
		return;
	}
	// LAST PLAYER CANNOT BE REMOVED
	if (activePlayers.length < 2) {
		return;
	}

	// REMOVE PLAYER FROM ACTIVE PLAYERS
	const index = activePlayers.indexOf(player);
	activePlayers.splice(index, 1);
}

io.on("connection", (socket) => {
	io.emit("all-players", allPlayers);
	io.emit("active-players", activePlayers);
	io.emit("image-links", imageLinks);
	io.emit("initial-configuration", configuration);
	io.emit("is-first-roll", firstRoll);

	socket.on("emit-roll", () => {
		// UPDATE ACTIVE PLAYERS
		updatePlayers(lastSelection);
		io.emit("active-players", activePlayers);

		// UPDATE CONFIGURATION
		configuration = getConfiguration();
		io.emit("configuration", configuration);

		const val = helpers.randomValue(22000, 25000);

		// 1500 -> CARDLIST WIDTH  /2 -> CENTER  150 -> CARD WIDTH
		const selectedPlayer =
			configuration[Math.floor((val + 1500 / 2) / 150)];
		lastSelection = selectedPlayer.name;
		io.emit("is-first-roll", firstRoll);
		io.emit("roll", val);
		firstRoll = false;
	});

	// SPIELER WERDEN ZUM POOL HINZUGEFÜGT ODER ENTFERNT
	socket.on("update-player", (player) => {
		updatePlayers(player);
		configuration = getConfiguration();
		io.emit("active-players", activePlayers);
		io.emit("configuration", configuration);
		firstRoll = true;
		io.emit("is-first-roll", firstRoll);
	});

	// STANDARDEINSTELLUNGEN
	socket.on("reset", () => {
		activePlayers = [...allPlayers];
		lastSelection = "";
		configuration = getConfiguration();
		firstRoll = true;

		io.emit("is-first-roll", firstRoll);
		io.emit("active-players", activePlayers);
		io.emit("configuration", configuration);
	});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
