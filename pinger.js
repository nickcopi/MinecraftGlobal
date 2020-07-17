const ping = require('minecraft-server-util');
const fs = require('fs');

const servers = fs.readFileSync('servers').toString().split('\n');
console.log(servers);


const init = async ()=>{
	const pings = await Promise.all(servers.map(async ip=>{
		return await ping(ip, 25565).catch(e=>{});
	}));
	console.log(pings.filter(ping=>ping).map(ping=>{
		return `${ping.host} of version ${ping.version} with ${ping.onlinePlayers}/${ping.maxPlayers} described as ${ping.descriptionText}`;
	}).join('\n'));

}

init();
