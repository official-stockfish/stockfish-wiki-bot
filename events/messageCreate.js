require("dotenv").config();

const { Events } = require("discord.js");
const { format } = require("../format/format");

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		const formatted = await format(message);

		if (formatted) {
			await message.reply(formatted);
		}
	},
};
