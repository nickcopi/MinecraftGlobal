module.exports = class CommandParser{
	constructor(serverManager){
		this.serverManager = serverManager;
	}
	parseCommand(msg,author){
		if(msg[0] !== '!') return;
		const line = msg.substring(1, msg.length);
		const words = line.split(' ');
		const command = words.shift();
		console.log(command,words);
		if(!this[command]) return;
		return this[command](words,author);

	}
	random(options,author){
		if(!options[0]){
			const server = this.serverManager.getRandomServer();
			return server.toEmbed(author);
		}
	}

}
