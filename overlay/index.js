/*
    osc-bundle.js contains all the mechanisms needed to run an overlay.
    It connects to your Spooder and reconnects automatically.

    Global vars:
    oscIP
    oscPort
    pluginSettings
*/

var activeEmotes = [];

function getOSCMessage(message){
    var address = message.address.split("/");
	
	if(address[1] == "emotewall"){
		switch(address[2]){
			case 'emotes':
                let chatObj = JSON.parse(message.args[0]);
				renderEmotes(chatObj.emotes);

			break;
			case 'panic':
				emoteLayerEnabled = false;
				rootMC.createToast("panic", "Emote wall has been disabled.");
			break;
		}
	}
}

function onOSCOpen(){
    
}

function renderEmotes(emotes){

    let startAnim = activeEmotes.length == 0;

    for(let e in emotes){
        let emoteDiv = document.createElement("div");
        emoteDiv.classList.add("emote");
        let newEmote = getEmoteImage(emotes[e].id);
        emoteDiv.innerHTML = newEmote;

        emoteDiv.style.position = "absolute";
        let spawnL = Math.round(200+(Math.random()*1400));
        let spawnT = Math.round(200+(Math.random()*700));
        emoteDiv.style.left = spawnL+"px";
        emoteDiv.style.top = spawnT+"px";
        emoteDiv.style.animationName = "ghostIn";
        emoteDiv.style.animationDuration = "0.5s";
        
        activeEmotes.push({
            element:emoteDiv,
            spawnL:spawnL,
            spawnT:spawnT,
            speedL:-2+(Math.random()*4),
            speedT:-2+(Math.random()*4),
            birthTime:Date.now(),
            dying:false,
            dead:false
        });
        document.querySelector(".emote-container").appendChild(emoteDiv);
        
    }
    if(startAnim){
        animateEmotes();
    }
    
}

function animateEmotes(){
    for(let e in activeEmotes){
        activeEmotes[e].spawnL += activeEmotes[e].speedL;
        activeEmotes[e].spawnT += activeEmotes[e].speedT;
        activeEmotes[e].element.style.left = activeEmotes[e].spawnL+"px";
        activeEmotes[e].element.style.top = activeEmotes[e].spawnT+"px";

        if(Date.now()-activeEmotes[e].birthTime > 5000){
            if(activeEmotes[e].dying == false){
                activeEmotes[e].element.style.animationName = "ghostOut";
                activeEmotes[e].element.style.animationDuration = "0.5s";
                activeEmotes[e].element.style.animationIterationCount = 1;
                activeEmotes[e].element.addEventListener("animationend", function(){
                    activeEmotes[e].element.style.opacity = 0;
                    activeEmotes[e].dead = true;
                });
                activeEmotes[e].dying = true;
            }
        }
    }
    for(let e in activeEmotes){
        if(activeEmotes[e].dead == true){
            activeEmotes[e].element.remove();
            activeEmotes.splice(e,1);
        }
    }
    if(activeEmotes.length > 0){
        window.requestAnimationFrame(animateEmotes);
    }
}

//We'll try to get an animated emote first. If that doesn't work, switch to static.
function getEmoteImage(id){
	var url = "https://static-cdn.jtvnw.net/emoticons/v2/"+id+"/animated/light/"+pluginSettings.emotesize;
	let tag = "<img src='"+url+"' onerror='onEmoteError(this)' emote='"+id+"'/>";
	return tag;
}

function onEmoteError(img){
	console.log(img);
	var emoteID = img.getAttribute("emote");
	if(img.src.includes("animated")){
		img.src = "https://static-cdn.jtvnw.net/emoticons/v2/"+emoteID+"/static/light/"+pluginSettings.emotesize;
	}else{
		console.log("EMOTE NOT FOUND");
	}
	
}