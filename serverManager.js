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
	getRandomVersionedServer(version){
		const options = Object.values(this.servers);
		const matchingOptions = options.filter(server=>server.matchesVersion(version));
		if(!matchingOptions.length) return;
		return matchingOptions[Math.floor(Math.random()*matchingOptions.length)];
	}
	getRandomActiveServer(){
		const options = Object.values(this.servers);
		const matchingoptions = options.filter(server=>server.isActive());
		if(!matchingoptions.length) return;
		return matchingoptions[math.floor(math.random()*matchingoptions.length)];
	}
	getRandomActiveVersionedServer(version){
		const options = Object.values(this.servers);
		const matchingoptions = options.filter(server=>server.isActive() && server.matchesversion(version));
		if(!matchingoptions.length) return;
		return matchingoptions[math.floor(math.random()*matchingoptions.length)];
	}
	async checkIp(ip){
		return await ping(ip, 25565).catch(e=>{});
	}
	async check(ip){
		const ping = await this.checkIp(ip);
		if(!ping) return; 
		const server = Object.assign(new Server,ping);
		return server;
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
