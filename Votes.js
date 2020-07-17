module.exports = class Votes{
	constructor(){
		this.score = 0;
		this.users = {};
	}
	vote(value,userId){
		if(userId in this.users) return false;
		this.score += value;
		this.users[userId] = value;
		return true;
	}


}
