const { SlashCommandBuilder } = require("discord.js");

const fs = require("node:fs");
const path = require("node:path");

const subcommandsPath = path.join(__dirname, "vote");
const subcommandFiles = fs.readdirSync(subcommandsPath).filter(file => file.endsWith(".js"));

const data = new SlashCommandBuilder()
  .setName("vote")
  .setDescription("Manage helper votes");

for (const file of subcommandFiles) {
    const subcommand = require(path.join(subcommandsPath, file));
    data.addSubcommand(subcommand.data);
}

module.exports = {
	data: data,
	async execute(interaction) {
    const subcommandName = interaction.options.getSubcommand();
    const subcommand = require(path.join(subcommandsPath, `${subcommandName}.js`));

    try {
      await subcommand.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this subcommand!',
        flags: MessageFlags.Ephemeral
      });
    }
	},
};
