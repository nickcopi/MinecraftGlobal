const Votes = require('./Votes');
module.exports = class Server{
	constructor(){
		if(this.votes)
			this.votes = Object.assign(new Votes, this.votes);
		else this.votes = new Votes();
	}
	toEmbed(author){
		const embed =  {
			"embed": {
				"title": `Server ${this.host}`,
				"color": 26112,
				"timestamp": (new Date()).toISOString(),
				"footer": {
					"icon_url": "https://cdn.discordapp.com/icons/733690560753172522/5a7e245a9c27884ef030e7fcf9689d34.png",
					"text": "Minecraft Global"
				},
				"fields": [
					{
						"name": "Ip",
						"value": this.host
					},
					{
						"name": "Port",
						"value": this.port
					},
					{
						"name": "Version",
						"value": this.version
					},
					{
						"name": "Players",
						"value": `${this.onlinePlayers}/${this.maxPlayers}`
					},
					{
						"name": "Description",
						"value": this.descriptionText
					}
				]
			}
		}
		if(author){
			embed.content = author.mention;
			//embed.embed.author = {
			//	name: `@${author.username}#${author.discriminator}`,
			//}
		}
		return embed;
	}
	matchesVersion(version){
		return this.version.includes(version);
	}
	isActive(){
		return this.onlinePlayers > 0;
	}
}
