const fs = require("fs");
const path = require("path");

module.exports = function loadTemplate(templateName, guildId, client) {
	let erorrchannels = [];
	let rawdata = fs.readFileSync(
		path.join(__dirname, `../templates/${guildId}/${templateName}`),
		"utf8"
	);
	const template = JSON.parse(rawdata);
	Object.keys(template).forEach(async channelid => {
		if (channelid == "icon") {
			client.guilds.cache.get(guildId).setIcon(template.icon);
			return;
		} else if (channelid == "banner") {
			if (
				!client.guilds.cache.get(guildId).premiumTier === "TIER_2" ||
				"TIER_3"
			) {
				erorrchannels.push(
					"Banner can only be set on servers with Nitro Boost Tier 2 or higher"
				);
			}
			client.guilds.cache.get(guildId).setBanner(template.banner);
			return;
		}

		const channel = await client.guilds.cache
			.get(guildId)
			.channels.cache.get(channelid);
		if (!channel || channel === undefined) {
			console.log("Channel not found");
			erorrchannels.push(`${channelid} : ${template[channelid]}`);
			return;
		}
		await channel.setName(template[channelid]);
		console.log(`Changed ${channel.name} to ${template[channelid]}`);
	});
	return erorrchannels;
};
