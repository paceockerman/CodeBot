exports.run = (client, message, args) => {
	const SQLite = require("better-sqlite3");
	const {
		RichEmbed
	} = require('discord.js');
	const sql = new SQLite('./investments.sqlite');
	//add money for people with no investments
	const investments = sql.prepare(`SELECT * FROM investments WHERE id = ${message.author.id};`).all();
	if (!investments.length) {
		const stmt = sql.prepare('INSERT INTO investments (uID, Id, symbol, shares) VALUES (?, ?, ?, ?)');
		const info = stmt.run(message.author.id + "dollars", message.author.id, "dollars", client.config.startingMoney);
		const embed = new RichEmbed().setTitle("You have recieved $" + client.config.startingMoney + ". You may use other commands now!").setColor(client.config.infoColor).setAuthor(message.member.displayName, message.author.displayAvatarURL).setTimestamp().addField("Prefix", client.config.prefix).addField("Commands", "**stock** *[symbol]* - information about company stock\n**buy** *[symbol] [shares]* - buy shares of company\n**sell** *[symbol] [shares]* - sell shares of company\n**portfolio** - view your portfolio").addField("Additional Help", "You can direct message the bot owner with the DM command for additional help or use the help command at any time.")
		message.channel.send(embed)
	}
}