const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('Retrieve Github commit')
        .addStringOption(option =>
            option
                .setName('commit-sha')
                .setDescription('Commit SHA')
                .setRequired(true)
        ),
    async execute(interaction) {
        const commitSha = interaction.options.getString('commit-sha');
        const link = `https://github.com/official-stockfish/Stockfish/commit/${commitSha}`;
        await interaction.reply(link);
    },
};