const { Events } = require("discord.js");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, dependencies) {
		if (
			!interaction.isChatInputCommand() &&
			!interaction.isContextMenuCommand()
		)
			return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(
				`No command matching ${interaction.commandName} was found.`
			);
			return;
		}

		try {
		  await command.execute(interaction, dependencies);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};
