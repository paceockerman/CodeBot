exports.run = async (client, message, args) => {
	const {
		RichEmbed
	} = require('discord.js');
	const alpha = require('alphavantage')({
		key: client.config.alphaVantageKey
	})
	if (!args[0]) {
		let er = new RichEmbed().setColor(client.config.errorColor).setTitle("Please enter a symbol after the command.")
		return message.channel.send(er)
	}
	//get data from api
	let data = await alpha.data.quote(args[0])
	if (!data['Global Quote']['01. symbol']) {
		return message.channel.send(args[0] + " is an invalid symbol.")
	}
	//send embed with data
	const embed = new RichEmbed().setColor(client.config.stockColor).setTimestamp().addField('Symbol', data['Global Quote']['01. symbol']).addField('Price', "$" + Number(data['Global Quote']['05. price']).toFixed(2)).addField('Open', "$" + Number(data['Global Quote']['02. open']).toFixed(2)).addField('High', "$" + Number(data['Global Quote']['03. high']).toFixed(2)).addField('Low', "$" + Number(data['Global Quote']['04. low']).toFixed(2)).addField('Change', data['Global Quote']['10. change percent'])
	message.channel.send(embed);
}