const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require("discord.js");

// Read the markdown files in the Stockfish-wiki directory
const wikiDirectory = path.join(__dirname, "..", "Stockfish.wiki");
const files = fs.readdirSync(wikiDirectory);

// Create an object to store the subcommands
const subcommands = {};

const reduce = function (inputString) {
    return inputString.replace(/[^\w- ]/g, '').replace(/\s+/g, '-').toLowerCase();
};

// Parse the markdown files to extract the headings
files.forEach((file) => {
  if (file.endsWith(".md")) {
    const filePath = path.join(wikiDirectory, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const headings = fileContent.match(/^#\s(.*)$/gm);
    if (headings && headings.length > 0) {
      const key = reduce(file.slice(0, file.length - 3));
      subcommands[key] = headings.map((heading) => ({
        name: reduce(heading.slice(2, heading.length)),
        url:
          `https://github.com/official-stockfish/Stockfish/wiki/${path.basename(
            file,
            ".md"
          )}` +
          "#" +
          reduce(heading.slice(2, heading.length)),
        value: heading.slice(2, heading.length).toLowerCase(),
      }));

      if (subcommands.length > 25) {
        subcommands.length = 25;
      }
    }
  }
});

// Create the slash command data
const commandData = new SlashCommandBuilder()
  .setName("wiki")
  .setDescription("Retrieve wiki articles");

// loop over keys
for (const [key, value] of Object.entries(subcommands)) {
  if (Object.keys(value).length > 25) {
    continue;
  }
  commandData.addSubcommand((subcommand) =>
    subcommand
      .setName(key)
      .setDescription(key)
      .addStringOption((option) =>
        option
          .setName("query")
          .setDescription("name")
          .addChoices(...value)
          .setRequired(true)
      )
  );
}

// Export the slash command data and execute function
module.exports = {
  data: commandData,
  async execute(interaction) {
    const query = reduce(interaction.options.getString("query"));
    const subs = subcommands[interaction.options.getSubcommand()];
    let page = null;

    for (const sub of subs) {
      if (sub["name"] === query) {
        page = sub;
        break;
      }
    }

    const embed = {
      title: page["name"],
      url: page["url"],
    };
    await interaction.reply({ embeds: [embed] });
  },
};
