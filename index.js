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
	async onMessageCreate(msg){
		if(msg.author.id === this.client.user.id) return;
		if(msg.channel.id !== this.settings.botChannelId) return;
		const result = await this.commandParser.parseCommand(msg.content,msg.author);
		if(result) this.client.createMessage(msg.channel.id,result);
	}
	onError(error){
		console.error(error);
	}
	getChannel(channelName){
		return this.client.guilds.get(this.settings.botGuild).channels.find(c => c.name === channel);
	}
	sendTop(){
		const server  = this.commandParser.serverManager.getTopServers(1)[0];
		if(!server) return;
		this.client.createMessage(this.settings.featuredChannelId,server.toEmbed());
	}

}

const init = async()=>{
	console.log('Initiating server list.');
	await serverManager.ingestServers();
	console.log('Initiating Discord bot.');
	const discord = new Discord(settings);
	require('./serverSchedule')(serverManager,discord);
}
init();

