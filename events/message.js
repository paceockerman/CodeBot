module.exports = (client, message) => {
  //import rich embed
  const { RichEmbed } = require('discord.js');
  if (message.author.bot) return;
  if (message.content.indexOf(client.config.prefix) !== 0) return;
  if (message.channel.type == "dm") return;
  if (message.author.id === '333744525279232033') return message.channel.send(new RichEmbed().setColor(client.config.errorColor).setTitle ("You do not have permission to use this bot."));
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);
  if (!cmd) return;
  cmd.run(client, message, args);
};
