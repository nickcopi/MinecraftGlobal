module.exports = class CommandParser{
	constructor(serverManager){
		this.serverManager = serverManager;
		this.actions = {
			'random':this.random.bind(this),
			'check':this.check.bind(this),
			'active':this.active.bind(this),
			'upvote':this.upvote.bind(this),
			//'downvote':this.downvote.bind(this)
		}
	}
	async parseCommand(msg,author){
		if(msg[0] !== '!') return;
		const line = msg.substring(1, msg.length);
		const words = line.split(' ');
		const command = words.shift().toLowerCase();
		console.log(command,words);
		if(!(command in this.actions)) return;
		return await this.actions[command](words,author);

	}
	async random(options,author){
		if(!options[0]){
			const server = this.serverManager.getRandomServer();
			return server.toEmbed(author);
		}
		const server = this.serverManager.getRandomVersionedServer(options[0]);
		if(server) return server.toEmbed(author);
		return `No server can be found for version ${options[0]}.`;
	}
	async check(options,author){
		if(!options[0]){
			return `An IP to check is required!`;
		}
		const server = await this.serverManager.check(options[0]);
		if(!server) return `Cannot find a minecraft server on ${options[0]}.`;
		return server.toEmbed(author);
	}
	async active(options,author){
		if(!options[0]){
			const server = this.serverManager.getRandomActiveServer();
			if(server) return server.toEmbed(author);
			return `No active server can be found.`;
		}
		const server = this.serverManager.getRandomActiveVersionedServer(options[0]);
		if(server) return server.toEmbed(author);
		return `No active server can be found for version ${options[0]}.`;
	}
	async upvote(options,author){
		if(!options[0])
			return `An IP to vote on must be specified.`;
		console.log(author);
		return this.serverManager.upvote(options[0],author.id);

	}

}
