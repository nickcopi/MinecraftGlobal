require('dotenv').config();
const settings = require('./settings.json');
const CommandParser = require('./CommandParser');
const serverManager = require('./serverManager');
const Eris = require('eris');
const clientOptions = {
    intents: [
        "guilds",
        "guildMessages"
    ]
};
class Discord{
	constructor(settings){
		this.client = new Eris(process.env.TOKEN, clientOptions);
		this.client.on('ready',this.onReady);
		this.client.on('messageCreate',this.onMessageCreate.bind(this));
		this.client.on('error',this.onError);
		this.client.connect();
		this.settings = settings;
		this.commandParser = new CommandParser(serverManager);
	}
	onReady(){
		console.log('Discord ready!')
	}
	onMessageCreate(msg){
		if(msg.author.id === this.client.user.id) return;
		//console.log(msg);
		const result = this.commandParser.parseCommand(msg.content);
		if(result) this.client.createMessage(msg.channel.id,result);
	}
	onError(error){
		console.error(error);
	}
	getChannel(ircChannel){
		return this.client.guilds.get(this.settings.bridgeGuild).channels.find(c => c.name === this.settings.channels[ircChannel])
	}

}

const init = async()=>{
	console.log('Initiating server list.');
	await serverManager.ingestServers();
	console.log('Initiating Discord bot.');
	const discord = new Discord(settings);
}
init();

