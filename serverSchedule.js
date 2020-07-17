const schedule = require('node-schedule');
let serverManager;
let discord;
schedule.scheduleJob('*/10 * * * *', async ()=>{
	console.log('Starting scheduled recheck.');
	await serverManager.updateServers();
	console.log('Finished recheck.');
});
schedule.scheduleJob('0 * * * *', async ()=>{
	await discord.sendTop();	

});
module.exports = (sm,d)=>{
	serverManager = sm;
	discord = d;
}
