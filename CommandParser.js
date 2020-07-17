module.exports = class CommandParser{
	constructor(serverManager){
		this.serverManager = serverManager;
		this.actions = {
			'random':this.random.bind(this),
			'check':this.check.bind(this),
			'active':this.active.bind(this),
			'upvote':this.upvote.bind(this),
			'downvote':this.downvote.bind(this),
			'top':this.top.bind(this),
			'help':this.help.bind(this)
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
		return this.serverManager.upvote(options[0],author.id);
	}
	async downvote(options,author){
		if(!options[0])
			return `An IP to vote on must be specified.`;
		return this.serverManager.downvote(options[0],author.id);

	}
	async top(options,author){
		const num = Number(options[0]);
		if(!num || isNaN(num)){
			return `A valid number of top servers must be specified.`;
		}
		const servers = this.serverManager.getTopServers(num);
		return servers.map(server=>server.toString()).join('\n').substring(0,1999);
	}
	async help(options,author){
		return {
			"embed": {
				"title": `Bot Help`,
				"color": 26112,
				"timestamp": (new Date()).toISOString(),
				"footer": {
					"icon_url": "https://cdn.discordapp.com/icons/733690560753172522/5a7e245a9c27884ef030e7fcf9689d34.png",
					"text": "Minecraft Global"
				},
				fields:[
					{
						name:'!help',
						value:'Display this help text'
					},
					{
						name:'!random',
						value:'Returns a random server, may be run as !random [version] to find a random server with a specific version.'
					},
					{
						name: '!active',
						value:'Returns a random server with at least 1 other person on it, may be run as !active [version] to find an active server with a specific version.'
					},
					{
						name:'!check',
						value:'Checks a specific IP for its minecraft server status. Must be run as !check [ip].'
					},
					{
						name:'!upvote', 
						value:'Upvotes a server. Must be run as !upvote [ip].'
					},
					{
						name: '!downvote',
						value: 'Upvotes a server. Must be run as !downvote [ip].'
					},
					{
						name:'!top',
						value:'Lists the top X most upvoted servers. Must be run as !top [x].'
					}
				]
			}
		}

	}
	

}
