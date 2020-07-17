const fs = require('fs');
const ping = require('minecraft-server-util');
const Server = require('./Server');
const Votes = require('./Votes');
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
		Object.entries(this.servers).forEach(([k,v])=>{
			this.servers[k].votes = Object.assign(new Votes, v.votes);
		});
		//await this.updateServers();
		await this.processIps(fs.readFileSync(ingestFile).toString().split('\n'));
		this.writeCache();
	}
	upvote(ip,id){
		
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
		const matchingOptions = options.filter(server=>server.isActive());
		if(!matchingOptions.length) return;
		return matchingOptions[Math.floor(Math.random()*matchingOptions.length)];
	}
	getRandomActiveVersionedServer(version){
		const options = Object.values(this.servers);
		const matchingOptions = options.filter(server=>server.isActive() && server.matchesVersion(version));
		if(!matchingOptions.length) return;
		return matchingOptions[Math.floor(Math.random()*matchingOptions.length)];
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
	async updateServers(){
		const servers = Object.values(this.servers);
		const updated = await Promise.all(servers.map(async server=>{
			const updatedServer = await this.check(server.host);
			return {
				ip: server.host,
				server:updatedServer
			}
		}));
		updated.forEach(update=>{
			if(!update.server)
				delete this.servers[update.ip];
			else {
				update.server.votes = this.servers[update.ip].votes;
				this.servers[update.ip] = update.server;
			}
		});
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
