exports.run = async (client, message, args) => {
	const {
		RichEmbed
	} = require('discord.js');
	message.channel.send(new RichEmbed().setColor(client.config.infoColor).addField("List of commands:", "ap - advanced portfolio\nbuy - buy stock\ndm - dm the owner\nhelp - help\nliquidate - sell all assets\nping - pong!\nportfolio - show portfolio\nstart - initialize portfolio\nstock - get data about a stock"))
}