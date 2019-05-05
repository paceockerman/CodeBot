exports.run = (client,message,args) => {
  client.users.get(client.config.ownerID).send(args.join(" "));
}
