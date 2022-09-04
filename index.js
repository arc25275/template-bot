const Discord = require("discord.js");
const GatewayIntentBits = Discord.GatewayIntentBits;
const loadTemplate = require("./Util/loadTemplate");
const parseFile = require("./Util/parseFile");
const client = new Discord.Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
const { token } = require("./config/config.json");
const fs = require("fs");
const createTemplate = require("./Util/createTemplate");
let templateList = [];

client.login(token);

client.on("ready", () => {
	console.log(`Ready`);
	fs.readdirSync("./templates").forEach(file => {
		templateList.push(file);
		console.log(file);
	});
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const { commandName } = interaction;
	const { guildId } = interaction;

	templateList = [];
	await fs.readdirSync(`./templates/${guildId}`).forEach(file => {
		templateList.push(file);
	});
	if (!interaction.member.permissions.has("ADMINISTRATOR")) {
		return interaction.reply({
			embeds: [
				{
					description: "You do not have permission to use this command.",
				},
			],
		});
	}
	if (commandName === "load") {
		let errors = [];
		const name = interaction.options?.getString("name");
		const template = interaction.options?.getAttachment("template");
		if (name && template) {
			return interaction.reply({
				embeds: [
					{
						description: `Please only choose one option`,
					},
				],
			});
		} else if (template) {
			const template = await parseFile(
				interaction.options.getAttachment("template"),
				templateList,
				guildId,
				client
			);
			if (templateList.includes(template)) {
				return interaction.reply({
					embeds: [
						{
							description: `Please rename the template to something other than the below: \n\n  \`${templateList.join(
								"\n"
							)}\``,
						},
					],
				});
			}
			let errors = await loadTemplate(template, guildId, client);
			return interaction.reply({
				embeds: [
					{
						description: `Template \`${template}\` loaded ${
							errors[0]
								? `with errors: \n\n \`${errors.join("\n")}\``
								: "successfully"
						}`,
					},
				],
			});
		} else if (name) {
			let errors = await loadTemplate(name, guildId, client);
			return interaction.reply({
				embeds: [
					{
						description: `Template \`${name}\` loaded ${
							errors[0]
								? `with errors: \n\n \`${errors.join("\n")}\``
								: "successfully"
						}`,
					},
				],
			});
		}
	}
	if (commandName === "create") {
		const name = interaction.options.getString("name");
		createTemplate(name, guildId, client);
		return interaction.reply({
			embeds: [
				{
					description: `Template \`${name}\` created`,
				},
			],
		});
	}
	if (commandName === "list") {
		return interaction.reply({
			embeds: [
				{
					description: `Templates: \n\n \`${templateList.join("\n")}\``,
				},
			],
		});
	}
	if (commandName === "download") {
		const name = interaction.options.getString("name");
		if (!templateList.includes) {
			return interaction.reply({
				embeds: [
					{
						description: `Template \`${name}\` does not exist, make sure you have the correct name and file extension`,
					},
				],
			});
		}
		return interaction.reply({ files: [`./templates/${guildId}/${name}`] });
	}
	// if (interaction.options.getSubcommand === "delete") {
	// 	const name = interaction.options.getString("name");
	// 	if (!templateList.includes) {
	// 		return interaction.reply({
	// 			embeds: [
	// 				{
	// 					description: `Template \`${name}\` does not exist, make sure you have the correct name and file extension`,
	// 				},
	// 			],
	// 		});
	// 	}
	// 	await fs.unlinkSync(`./templates/${guildId}/${name}`);
	// 	return interaction.reply({
	// 		embeds: [
	// 			{
	// 				description: `Template \`${name}\` deleted`,
	// 			},
	// 		],
	// 	});
	// }
});
