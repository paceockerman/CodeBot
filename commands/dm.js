exports.run = (client, message, args) => {
	const {
		RichEmbed
	} = require('discord.js')
	client.users.get(client.config.ownerID).send(new RichEmbed().setColor(client.config.infoColor).setTitle(args.join(" ") + " **from** " + message.author.id));
}