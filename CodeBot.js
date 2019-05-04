// Vars
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require("./config.json");

// Event Functions
client.on('ready', () => {
	console.log("Connected as " + client.user.tag)
})

client.on('message', (message) => {
	if (message.content.includes("yee")) {
 		message.channel.send("haw")
	}
})

// Actually logging in
client.login(config.token);
