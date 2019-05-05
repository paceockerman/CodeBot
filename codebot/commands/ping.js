exports.run = (client, message, args) => {
    message.channel.send("Pong! Average heartbeat ping of the websocket is " + Math.round(client.ping) + "ms").catch(console.error);
}
