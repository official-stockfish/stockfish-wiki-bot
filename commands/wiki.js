const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');
const marked = require('marked');

// Read the markdown files in the Stockfish-wiki directory
const wikiDirectory = path.join(__dirname, '..', 'Stockfish.wiki');
const files = fs.readdirSync(wikiDirectory);

// Create an object to store the subcommands
const subcommands = {};

const slugify = (inputString) => {
	return inputString.replace(/[^\w\s_/\-.+]/g, '').replace(/[\s_/\-.+]+/g, '-').replace(/-+$/, '').toLowerCase();
};

const simplifyPageName = (name) => {
	return name.replace(/\s+/g, '-');
};

const baseUrl = 'https://official-stockfish.github.io/docs/stockfish-wiki/';

// Parse the markdown files to extract the headings
files.forEach((file) => {
	// Ignore files like _Footer.md or _Sidebar.md
	if (file.endsWith('.md') && !file.startsWith('_')) {
		const filePath = path.join(wikiDirectory, file);
		const fileName = path.basename(file, '.md');
		const markdownContent = fs.readFileSync(filePath, 'utf-8');
		const tokens = marked.lexer(markdownContent);

		subcommands[slugify(fileName)] = {
			file: fileName,
			queries: [],
		};

		tokens.forEach(token => {
			if (token.type === 'heading' && token.depth === 2) {
				subcommands[slugify(fileName)].queries.push([token.text, []]);
			}
			else if (token.type === 'heading' && token.depth === 3) {
				const previoush1 = subcommands[slugify(fileName)].queries[subcommands[slugify(fileName)].queries.length - 1];
				if (previoush1) {
					previoush1[1].push(token.text);
				}
			}
		});

		if (subcommands.length > 25) {
			subcommands.length = 25;
		}
	}
});

// Create the slash command data
const commandData = new SlashCommandBuilder()
	.setName('wiki')
	.setDescription('Retrieve wiki articles');

// loop over keys
for (const [key, value] of Object.entries(subcommands)) {
	const choices = value.queries.map(query => ({ name: query[0], value: query[0] }));
	commandData.addSubcommand((subcommand) => {
		const option = subcommand
			.setName(key)
			.setDescription(value.file.replace(/-/g, ' '));

		if (value.queries.length > 0) {
			option.addStringOption((opt) =>
				opt
					.setName('query')
					.setDescription('Choose a heading')
					.addChoices(...choices.slice(0, 25))
					.setRequired(false),
			);
		}

		return subcommand;
	});
}

// Export the slash command data and execute function
module.exports = {
	data: commandData,
	async execute(interaction) {
		const requestedQuery = interaction.options.getString('query');
		const requestedSub = subcommands[interaction.options.getSubcommand()];

		const embed = {
			author: {
				name: 'Stockfish Wiki',
				icon_url: 'https://raw.githubusercontent.com/official-stockfish/stockfish-web/master/static/images/logo/icon_128x128.png',
				url: baseUrl + 'Home.html',
			},
			title: `**${requestedSub.file.replace(/-/g, ' ')}**`,
			url: baseUrl + simplifyPageName(requestedSub.file) + '.html',
			color: parseInt('518047', 16),
			description: '',
		};

		if (requestedQuery) {
			for (const subQuery of requestedSub.queries) {
				if (subQuery[0] === requestedQuery) {
					embed.title += ': ' + requestedQuery;
					embed.url += '#' + slugify(requestedQuery);
					subQuery[1].forEach(h2 => {
						embed.description += `- [${h2}](${baseUrl}${simplifyPageName(requestedSub.file)}.html#${slugify(h2)})\n`;
					});
					break;
				}
			}
		}
		else {
			for (const subQuery of requestedSub.queries) {
				embed.description += `- [${subQuery[0]}](${baseUrl}${simplifyPageName(requestedSub.file)}.html#${slugify(subQuery[0])})\n`;
			}
		}

		await interaction.reply({ embeds: [embed] });
	},
};
