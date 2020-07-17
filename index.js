require('dotenv').config();
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
	}
	onReady(){
		console.log('Discord ready!')
	}
	onMessageCreate(msg){
		console.log(msg.channel.name);
		console.log(msg.author.id);
		console.log(this.client);
		//this.client.createMessage(msg.channel.id,msg.channel.name);
	}
	onError(error){
		console.error(error);
	}
	getChannel(ircChannel){
		return this.client.guilds.get(this.settings.bridgeGuild).channels.find(c => c.name === this.settings.channels[ircChannel])
	}

}
const discord = new Discord();

