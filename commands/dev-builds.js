require('dotenv').config()

const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const token = process.env.GITHUB_API_TOKEN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev-builds')
        .setDescription('The latest stockfish dev builds'),
    async execute(interaction) {
        const repository = "official-stockfish/Stockfish";
        const branch = "master";
        const event = "push";
        const headers = {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github+json"
        }
        try {
            const response = await axios.get(`https://api.github.com/repos/${repository}/actions/runs?branch=${branch}&event=${event}&sort=asc&direction=desc`, {headers});
            const latestRun = response.data.workflow_runs[0];
            const link = `https://github.com/${repository}/actions/runs/${latestRun.id}#artifacts`;
            const embed = {
                title: "dev-builds",
                url: link,
                description: "The latest builds can be found under 'artifacts' at the bottom of the page.",
            }
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            interaction.reply("Sorry, an error occurred while trying to retrieve the latest build.")
        }
    },
};
