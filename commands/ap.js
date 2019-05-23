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
	let embedstat = new RichEmbed().setColor(client.config.stockColor).setTimestamp()
	//redirect to start command
	let member = message.mentions.members.first();
	if (!args[0]) {
		investments = sql.prepare(`SELECT * FROM investments WHERE id = ${message.author.id};`).all();
	} else {
		investments = sql.prepare(`SELECT * FROM investments WHERE id = ${member.user.id};`).all();
	}
	if (!investments.length) {
		return message.channel.send(new RichEmbed().setColor(client.config.errorColor).setTitle("Please initialize with the command " + client.config.prefix + "start"))
	}
	//api plan only allows 5 requests per min
	const stockLimit = client.config.stockLimit
	//create and send embed with invesments
	const embed = new RichEmbed().setColor(client.config.portfolioColor).setTimestamp().addField("Dollars", "$" + investments[0].shares.toFixed(2));
	if (investments.length === 1) {
		embed.setTitle("Sorry, you have no investments.");
	} else {
		let newText = "";
		let netWorth = Number(investments[0].shares);
		for (let i = 1; i <= Math.min(stockLimit, investments.length - 1); i++) {
			let data = await alpha.data.quote(investments[i].symbol)
			embedstat.addField(data['Global Quote']['01. symbol'], "Price:  $" + Number(data['Global Quote']['05. price']).toFixed(2) + "\nChange: " + data['Global Quote']['10. change percent'])
			newText += investments[i].symbol + " - " + investments[i].shares + " - $" + (investments[i].shares * data['Global Quote']['05. price']).toFixed(2) + "\n";
			netWorth += Number(investments[i].shares * data['Global Quote']['05. price'])
		}
		embed.addField("Investments", newText);
		if (investments.length > stockLimit + 1) {
			embed.addField("Net Worth", "The net worth command is limited by the api. Please consider donating, or sell stocks down to " + stockLimit + " or fewer different companies.");
			message.channel.send(new RichEmbed().setColor(client.config.infoColor).setTitle("The portfolio command is limited by the API.  Your first " + stockLimit + " stocks are shown.  To allow viewing of more than " + stockLimit + " stocks please donate to the bot owner."))
		} else {
			embed.addField("Net Worth", "$" + netWorth.toFixed(2));
		}
	}
	message.channel.send(embed);
	if (investments.length !== 1) message.channel.send(embedstat);
}