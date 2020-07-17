module.exports = class CommandParser{
	constructor(serverManager){
		this.serverManager = serverManager;
		this.actions = {
			'random':this.random.bind(this)
		}
	}
	parseCommand(msg,author){
		if(msg[0] !== '!') return;
		const line = msg.substring(1, msg.length);
		const words = line.split(' ');
		const command = words.shift();
		console.log(command,words);
		if(!(command in this.actions)) return;
		return this.actions[command](words,author);

	}
	random(options,author){
		if(!options[0]){
			const server = this.serverManager.getRandomServer();
			return server.toEmbed(author);
		}
		const server = this.serverManager.getRandomVersionedServer(options[0]);
		if(server) return server.toEmbed(author);
		return `No server can be found for version ${options[0]}.`;
	}

}
