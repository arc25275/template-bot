const fs = require("fs");
const path = require("path");
const { ChannelType, Collection } = require("discord.js");

module.exports = async function createTemplate(templateName, guildId, client) {
	obj = {};
	obj.banner = client.guilds.cache.get(guildId).bannerURL();
	obj.icon = client.guilds.cache.get(guildId).iconURL();
	const categories = new Collection();
	client.guilds.cache.get(guildId).channels.cache.forEach(channel => {
		if (channel.type === ChannelType.GuildCategory) {
			categories.set(channel.id, channel);
		}
	});
	let sortedCategories = categories.sort((a, b) => a.position - b.position);
	sortedCategories.forEach(category => {
		obj[category.id] = category.name;
		const children = category.children.cache.sort(
			(a, b) => a.position - b.position
		);
		children.forEach(child => {
			obj[child.id] = child.name;
		});
	});
	fs.writeFileSync(
		path.join(__dirname, `../templates/${guildId}/${templateName}.json`),
		JSON.stringify(obj, null, 4)
	);
};
