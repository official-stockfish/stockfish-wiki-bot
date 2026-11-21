const {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	MessageFlags,
} = require('discord.js');

const data = new ContextMenuCommandBuilder()
	.setName('Restore embed')
	.setType(ApplicationCommandType.Message);

module.exports = {
	data: data,
	async execute(interaction) {
		try {
			const message = await interaction.channel.messages.fetch(
				interaction.targetId,
			);

			await message.suppressEmbeds(false);

			await interaction.reply({
				content: 'Embeds successfully restored.',
				flags: MessageFlags.Ephemeral,
			});
		}
		catch (error) {
			console.error('Error restoring embeds:', error);
			await interaction.reply({
				content: 'Failed to restore embeds. Please ensure I have the "Manage Messages" permission in this channel.',
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};
