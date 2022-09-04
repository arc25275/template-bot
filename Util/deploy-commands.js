const { SlashCommandBuilder, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { clientId, guildIds, token } = require("../config/commandConfig.json");

const commands = [
	new SlashCommandBuilder()
		.setName("create")
		.setDescription(
			"Creates a template from existing server channels and categories"
		)
		.addStringOption(option =>
			option
				.setName("name")
				.setDescription("The name of the template")
				.setRequired(true)
		),
	new SlashCommandBuilder()
		.setName("load")
		.setDescription("Loads a template into the server")
		.addAttachmentOption(option =>
			option.setName("template").setDescription("The template to load")
		)
		.addStringOption(option =>
			option.setName("name").setDescription("The name of existing template")
		),
	new SlashCommandBuilder()
		.setName("list")
		.setDescription("Lists existing templates"),
	new SlashCommandBuilder()
		.setName("download")
		.setDescription("Dowloads an existing template")
		.addStringOption(option =>
			option
				.setName("name")
				.setDescription("The template to download")
				.setRequired(true)
		),
	// .addSubcommand(subcommand =>
	// 	subcommand
	// 		.setName("delete")
	// 		.setDescription("Deletes an existing template")
	// 		.addStringOption(option =>
	// 			option
	// 				.setName("name")
	// 				.setDescription("The template to delete")
	// 				.setRequired(true)
	// 		)
	// )
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

guildIds.forEach(async guildId => {
	rest
		.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
		.then(data =>
			console.log(
				`Successfully registered ${data.length} application commands in guild ${guildId}`
			)
		)
		.catch(console.error);
});
