const { Events } = require("discord.js");
const { chessify } = require("../app/chessify");

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		const formatted = await chessify(message);

		if (formatted) {
			await message.reply(formatted);
		}
	},
};
