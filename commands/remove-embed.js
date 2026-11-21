const {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	MessageFlags,
} = require('discord.js');

const data = new ContextMenuCommandBuilder()
	.setName('Remove embed')
	.setType(ApplicationCommandType.Message);

module.exports = {
	data: data,
	async execute(interaction) {
		try {
			const message = await interaction.channel.messages.fetch(
				interaction.targetId,
			);

			await message.suppressEmbeds(true);

			await interaction.reply({
				content: 'Embeds successfully removed.',
				flags: MessageFlags.Ephemeral,
			});
		}
		catch (error) {
			console.error('Error suppressing embeds:', error);
			await interaction.reply({
				content: 'Failed to remove embeds. Please ensure I have the "Manage Messages" permission in this channel.',
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};
