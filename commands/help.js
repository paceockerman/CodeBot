exports.run = (client, message, args) => {
	const {
		RichEmbed
	} = require('discord.js');
	const embed = new RichEmbed().setColor(client.config.infoColor).setAuthor(message.member.displayName, message.author.displayAvatarURL).setTimestamp().addField("Prefix", client.config.prefix).addField("Commands", "**stock** *[symbol]* - information about company stock\n**buy** *[symbol] [shares]* - buy shares of company\n**sell** *[symbol] [shares]* - sell shares of company\n**portfolio** - view your portfolio").addField("Additional Help", "You can direct message the bot owner with the DM command for additional help or use the ah (advanced help) for a complete list of commands.")
	message.channel.send(embed)
}