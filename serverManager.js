const fs = require('fs');
const ping = require('minecraft-server-util');
const Server = require('./Server');
const cacheFile = 'serverCache.json';
const ingestFile = 'servers';
class ServerManager{
	constructor(){
		this.servers = {};
		this.bads = [];
	}
	readCache(){
		try{
			return JSON.parse(fs.readFileSync(cacheFile).toString()); 	
		} catch(e){
			return{
				bads:[],
				servers:{}
			}
		}
	}
	writeCache(){
		fs.writeFileSync(cacheFile,JSON.stringify({
			bads:this.bads,
			servers:this.servers
		}));
	}
	async ingestServers(){
		const cache = this.readCache();
		this.bads = cache.bads;
		this.servers = cache.servers;
		await this.processIps(fs.readFileSync(ingestFile).toString().split('\n'));
		this.writeCache();
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
			if(this.servers[ip] || this.bads.includes(ip)) return;
			const ping = await this.checkIp(ip);
			if(!ping) this.bads.push(ip);
			return ping;
		}));
		pings.filter(ping=>ping).forEach(ping=>{
			this.servers[ping.host] = Object.assign(new Server,ping);
		});
	}

}
module.exports = new ServerManager();
