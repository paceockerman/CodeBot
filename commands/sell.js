exports.run = async (client, message, args) => {
	//initialization
	const SQLite = require("better-sqlite3");
	const sql = new SQLite('./investments.sqlite');
	const {
		RichEmbed
	} = require('discord.js');
	const alpha = require('alphavantage')({
		key: client.config.alphaVantageKey
	})
	//redirect to start command
	const investments = sql.prepare(`SELECT * FROM investments WHERE id = ${message.author.id};`).all();
	if (!investments.length) {
		return message.channel.send(new RichEmbed().setColor(client.config.errorColor).setTitle("Please initialize with the command " + client.config.prefix + "start"))
	}
	//input checking
	let er = new RichEmbed().setColor(client.config.errorColor).setTitle("Please use the format **sell** *[symbol] [shares]*")
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
	//insert investment
	const x = sql.prepare(`SELECT shares FROM investments WHERE id = ${message.author.id} AND symbol = "${args[0]}";`).all();
	if (!x.length) {
		return message.channel.send(new RichEmbed().setColor(client.config.errorColor).setTitle("You do not own any " + args[0]))
	} else {
		let newShares = Number(x[0].shares) - Number(args[1]);
		if (newShares < 0) {
			return message.channel.send(new RichEmbed().setColor(client.config.errorColor).setTitle("You do not have enough shares."))
		} else if (newShares == 0) {
			sql.prepare(`DELETE FROM investments WHERE id = ${message.author.id} AND symbol = "${args[0]}";`).run()
		} else {
			sql.prepare(`UPDATE investments SET shares = ${newShares} WHERE id = ${message.author.id} AND symbol = "${args[0]}";`).run();
		}
	}
	//adjust dollars accordingly
	let dollars = sql.prepare(`SELECT * FROM investments WHERE id = ${message.author.id} AND symbol = "dollars";`).all();
	let remainingDollars = dollars[0].shares + data['Global Quote']['05. price'] * args[1];
	sql.prepare(`UPDATE investments SET shares = ${remainingDollars} WHERE id = ${message.author.id} AND symbol = "dollars";`).run();
	//confirmation
	message.channel.send(new RichEmbed().setColor(client.config.infoColor).setTitle("You have sold " + args[1] + " shares of " + args[0] + " for $" + args[1] * data['Global Quote']['05. price']))
}