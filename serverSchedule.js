const schedule = require('node-schedule');
let serverManager;
schedule.scheduleJob('*/10 * * * *', async ()=>{
	console.log('Starting scheduled recheck.');
	await serverManager.updateServers();
	console.log('Finished recheck.');
});
module.exports = (sm)=>{
	serverManager = sm;
}
