class EmoteWall {
	
	constructor() {
		this.onChat = this.onChat.bind(this);
	}
	
	activeEmotes = {};
	
	commandList = {
		
	};
	
	txtEncoder = new TextEncoder();
	
	
	onChat(message){
		
		sendToTCP("/emotewall/emotes", JSON.stringify({emotes:message.tags.emotes}));
	}
}

module.exports = EmoteWall;