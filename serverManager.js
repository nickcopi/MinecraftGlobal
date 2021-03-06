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
		process.on('SIGINT',()=>{
			console.log('Exiting...');
			this.writeCache();
			process.exit();
		});
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
			this.servers[k] = Object.assign(new Server,v);
			this.servers[k].votes = Object.assign(new Votes, v.votes);
		});
		//await this.updateServers();
		await this.processIps(fs.readFileSync(ingestFile).toString().split('\n'));
		this.writeCache();
	}
	getTopServers(num){
		const options = Object.values(this.servers);
		return options.sort((b,a)=>a.votes.score - b.votes.score).slice(0,num);
	}
	upvote(ip,id){
		if(!(ip in this.servers)) return `Cannot find server with ip ${ip}.`
		if(this.servers[ip].votes.vote(1,id)) return `Upvoted ${ip}!`;
		return `You have already voted on ${ip}!`;
	}
	downvote(ip,id){
		if(!(ip in this.servers)) return `Cannot find server with ip ${ip}.`
		if(this.servers[ip].votes.vote(-1,id)) return `Downvoted ${ip}!`;
		return `You have already voted on ${ip}!`;
	}
	getRandomServer(){
		const options = Object.values(this.servers);
		const selected = options[Math.floor(Math.random()*options.length)];
		return selected;
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
		if(this.servers[ip]) server.votes = this.servers[ip].votes;
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
