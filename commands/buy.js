exports.run = async (client, message, args) => {
	const SQLite = require("better-sqlite3");
	const {
		RichEmbed
	} = require('discord.js');
	const sql = new SQLite('./investments.sqlite');
	const alpha = require('alphavantage')({
		key: client.config.alphaVantageKey
	})
	//redirect to start command
	const investments = sql.prepare(`SELECT * FROM investments WHERE id = ${message.author.id};`).all();
	if (!investments.length) {
		return message.channel.send(new RichEmbed().setColor(client.config.errorColor).setTitle("Please initialize with the command " + client.config.prefix + "start"))
	}
	//input checking
	let er = new RichEmbed().setColor(client.config.errorColor).setTitle("Please use the format **invest** *[symbol] [shares]*")
	if (!args[0] || !args[1]) return message.channel.send(er)
	if (args[0] <= 0) return message.channel.send(er)
	if (isNaN(args[1])) return message.channel.send(er)
	args[0] = args[0].toUpperCase();
	//grab data from alphavantage
	let data = await alpha.data.quote(args[0])
	//input checking
	if (!data['Global Quote']['01. symbol']) return message.channel.send(new RichEmbed().setColor(client.config.errorColor).setTitle(args[0] + " is not a valid symbol"))
	/*
	 * Add function to suggest what may be symbols they wanted, using alphavantage api
	 */
	//check if they have enough money to invest, then if they do adjust dollars accordingly
	let dollars = sql.prepare(`SELECT * FROM investments WHERE id = ${message.author.id} AND symbol = "dollars";`).all();
	let remainingDollars = dollars[0].shares - data['Global Quote']['05. price'] * args[1];
	if (remainingDollars >= 0) {
		sql.prepare(`UPDATE investments SET shares = ${remainingDollars} WHERE id = ${message.author.id} AND symbol = "dollars";`).run();
	} else {
		return message.channel.send(new RichEmbed().setColor(client.config.errorColor).setTitle("You do not have enough money for that purchase"));
	}
	//insert investment
	const x = sql.prepare(`SELECT shares FROM investments WHERE id = ${message.author.id} AND symbol = "${args[0]}";`).all();
	if (!x.length) {
		const stmt = sql.prepare('INSERT INTO investments (uID, Id, symbol, shares) VALUES (?, ?, ?, ?)');
		const info = stmt.run(message.author.id + args[0], message.author.id, args[0], args[1]);
	} else {
		let newShares = Number(x[0].shares) + Number(args[1]);
		sql.prepare(`UPDATE investments SET shares = ${newShares} WHERE id = ${message.author.id} AND symbol = "${args[0]}";`).run();
	}
	//confirmation
	message.channel.send(new RichEmbed().setColor(client.config.infoColor).setTitle("You have bought " + args[1] + " shares of " + args[0] + " for $" + args[1] * data['Global Quote']['05. price']))
}