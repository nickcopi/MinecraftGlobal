module.exports = class Server{
	constructor(){

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
			embed.author = {
				name: msg.author.username,
				icon_url: msg.author.avatarURL
			}
		}
		return embed;
	}
}
