const fs = require('fs');
const ping = require('minecraft-server-util');
const Server = require('./Server');
class ServerManager{
	constructor(){
		this.servers = {

		}
	}
	async ingestServers(){
		await this.processIps(fs.readFileSync('servers').toString().split('\n'));
	}
	getRandomServer(){
		const options = Object.values(this.servers);
		return options[Math.floor(Math.random()*options.length)];
	}
	async checkIp(ip){
		return await ping(ip, 25565).catch(e=>{});
	}
	async processIps(ips){
		const pings = await Promise.all(ips.map(async ip=>{
			if(this.servers[ip]) return;
			return await this.checkIp(ip);
		}));
		pings.filter(ping=>ping).forEach(ping=>{
			this.servers[ping.host] = Object.assign(new Server,ping);
			//return `${ping.host} of version ${ping.version} with ${ping.onlinePlayers}/${ping.maxPlayers} described as ${ping.descriptionText}`;
		});
	}

}
module.exports = new ServerManager();