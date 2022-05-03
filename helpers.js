function randomValue(min, max) {
	// Returns randomValue in range
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function copyArray(toCopy) {
	// Copy array in parameters and returns it -> Safe to use
	let copy = [];
	for (let i = 0; i < toCopy.length; i++) {
		copy.push(toCopy[i]);
	}
	return copy;
}

function getRarity(value) {
	if (value == 1) {
		return 3;
	} else if (value == 2 || value == 3) {
		return 2;
	} else {
		return 1;
	}
}

function getRandomElement(items) {
	if (items === undefined) {
		console.log("Items are undefined!");
		return "Error";
	}
	return items[Math.floor(Math.random() * items.length)];
}

// Returns player order
// Param: max = upper ceiling
function new_seed(max) {
	let seed = [];
	for (let i = 0; i < 200; i++) {
		seed.push(randomValue(0, max));
	}
	return seed;
}

const image_links = {
	"1_basti": "1_basti.jpg",
	"2_basti": "2_basti.jpg",
	"3_basti": "3_basti.jpg",

	"1_nigge": "1_nigge.jpg",
	"2_nigge": "2_nigge.jpg",
	"3_nigge": "3_nigge.jpg",

	"1_vale": "1_vale.jpeg",
	"2_vale": "2_vale.jpeg",
	"3_vale": "3_vale.jpeg",

	"1_vimme": "1_vimme.jpg",
	"2_vimme": "2_vimme.jpg",
	"3_vimme": "3_vimme.PNG",

	"1_ps": "1_ps.jpg",
	"2_ps": "2_ps.jpg",
	"3_ps": "3_ps.jpg",

	"1_maex": "1_maex.jpg",
	"2_maex": "2_maex.jpeg",
	"3_maex": "3_maex.jpeg",

	"1_fixe": "1_fixe.PNG",
	"2_fixe": "2_fixe.PNG",
	"3_fixe": "3_fixe.jpeg",

	"1_jki": "1_jki.jpg",
	"2_jki": "2_jki.jpeg",
	"3_jki": "3_jki.jpg",

	"1_alex": "1_alex.JPG",
	"2_alex": "2_alex.JPG",
	"3_alex": "3_alex.JPG",

	"1_jolle": "1_jolle.jpg",
	"2_jolle": "2_jolle.JPG",
	"3_jolle": "3_jolle.JPG",

	"1_mendel": "1_mendel.jpg",
	"2_mendel": "2_mendel.jpg",
	"3_mendel": "3_mendel.jpg",

	"1_ayniin": "1_ayniin.jpg",
	"2_ayniin": "2_ayniin.jpg",
	"3_ayniin": "3_ayniin.jpg",
};

module.exports = {
	randomValue,
	copyArray,
	getRarity,
	new_seed,
	getRandomElement,
	image_links,
};
