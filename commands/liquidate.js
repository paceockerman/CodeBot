exports.run = async (client, message, args) => {
	const SQLite = require("better-sqlite3");
	const sql = new SQLite('./investments.sqlite');
	const {
		RichEmbed
	} = require('discord.js');
	const alpha = require('alphavantage')({
		key: client.config.alphaVantageKey
	})
	let investments;
	//redirect to start command
	investments = sql.prepare(`SELECT * FROM investments WHERE id = ${message.author.id};`).all();
	if (!investments.length) {
		return message.channel.send(new RichEmbed().setColor(client.config.errorColor).setTitle("Please initialize with the command " + client.config.prefix + "start"))
	}
	//api plan only allows 5 requests per min
	const stockLimit = client.config.stockLimit
	let netWorth = Number(investments[0].shares);
	if (investments.length > stockLimit + 1) {
		message.channel.send(new RichEmbed().setColor(client.config.infoColor).setTitle("The liquidate command is limited by the API. To use this command please sell down to " + stockLimit + " stocks or donate to the bot owner"))
	} else {
		for (let i = 1; i <= investments.length - 1; i++) {
			let data = await alpha.data.quote(investments[i].symbol)
			netWorth += Number(investments[i].shares * data['Global Quote']['05. price'])
		}
		sql.prepare(`DELETE FROM investments WHERE id = ${message.author.id} AND symbol != "dollars";`).run()
	}
	sql.prepare(`UPDATE investments SET shares = ${netWorth} WHERE id = ${message.author.id} AND symbol = "dollars";`).run();
	message.channel.send(new RichEmbed().setColor(client.config.infoColor).setTitle("You have liquidated your assets.  You have $" + netWorth.toFixed(2)))
}