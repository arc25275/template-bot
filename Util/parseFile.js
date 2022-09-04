const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));
const util = require("util");
const fs = require("fs");
const streamPipeline = util.promisify(require("stream").pipeline);

module.exports = async function parseFile(file, list, guildId, client) {
	let url = file.url;
	if (!list.includes(file.name)) {
		const response = await fetch(url);
		if (!response.ok)
			throw new Error(`unexpected response ${response.statusText}`);
		await streamPipeline(
			response.body,
			fs.createWriteStream(`./templates/${guildId}/${file.name}`)
		);
	}

	return file.name;
};
