const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require("discord.js");

const directoryPath = path.join(__dirname, "../Stockfish.wiki");
const wikiTable = {};

// Read all files in directory synchronously
const files = fs.readdirSync(directoryPath);
files.forEach(function (file) {
  // Check if file is markdown
  if (path.extname(file) === ".md") {
    const data = fs.readFileSync(path.join(directoryPath, file), "utf8");
    const lines = data.split(/\r?\n/);
    let name = null;
    let url = null;
    let description = null;

    // Loop through lines in file
    for (const line of lines) {
      // Check if line is a heading
      if (line.startsWith("# ")) {
        // Set name as heading text
        name = line.replace(/#/g, "").trim();
        // Set url as file path without extension
        url = `https://example.com/wiki/${path.basename(file, ".md")}`;

        // Set description as first line of file
        if (lines[0]) {
          description = lines[0].trim();
        }

        // Add to wikiTable
        if (name && url && description) {
        //   const id = Object.keys(wikiTable).length;
          wikiTable[name] = { name, url, description };
        }
      }
    }
  }
});

// Generate options array
const options = [];
for (const id in wikiTable) {
  options.push({ name: wikiTable[id].name, value: id });
}

// Export module
module.exports = {
  data: new SlashCommandBuilder()
    .setName("wiki")
    .setDescription("Retrieve wiki articles")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("name")
        .addChoices(...options)
        .setRequired(true)
    ),
  async execute(interaction) {
    const page = wikiTable[interaction.options.getString("query")];
    const embed = {
      title: page.name,
      url: page.url,
      description: page.description,
    };
    await interaction.reply({ embeds: [embed] });
  },
};
