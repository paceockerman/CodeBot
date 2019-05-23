exports.run = async (client, message, args) => {
	let sent = await message.channel.send('Pinging...')
	sent.edit(`Pong! Took ${sent.createdTimestamp - message.createdTimestamp}ms`);
}