//nodig voor werking
var Discord = require('discord.io');
var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');



//logs in console server
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});



//opstarten bot
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
	  bot.setPresence( {game: {name:"Korfbal"}} );
});



//muted users opslaan in array
var mutedusers = ["000000"];

//Doge videos uit tekstbestand halen
var fs = require("fs");
var links = fs.readFileSync("./data-files/doge_videos.txt", "utf-8");

//simulate: "Alexie Chaerle is typing....."
bot.simulateTyping("400647401473310731");




// bij elke bericht (commando's:)
bot.on('message', function (user, userID, channelID, message, evt) {

		//commando eruit halen
		var cmd = message.toLowerCase().split(" ");

		//Gemute mensen hun berichten blokkeren:

		for (var i = 0; i < mutedusers.length; i++)
		{
			if (userID == mutedusers[i])
			{
			bot.sendMessage({
				to: '771397311673663539',
				message: user + " : " + message,
			});

			bot.deleteMessage({
			channelID: channelID,
				messageID: evt.d.id
			});
			}
		}


		//controleren op bot-channel commands;
		if (channelID == 400650437688033290) {
    switch(cmd[0]) {
			case 'print':
					bot.sendMessage({
                    to: channelID,
                    message: '> **Commandos werken enkel in #botchannel **\n> **plsdoge** - geeft een foto van doge weer\n> **mute gebruiker** - mute een gebruiker\n> **unmute gebruiker** - unmute een gebruiker',
                });
            break;

			case 'mute':
			if (userID == 249517085133111296 || userID == 439520489031860224)
			{

					mutedusers.push(cmd[1]);

					bot.sendMessage({
                    to: channelID,
                    message: '> Succesvol gemute',
					});

			}
            break;

			case 'unmute':

			if (userID == 249517085133111296 || userID == 439520489031860224)
			{		//user.unmute( {userID: userID});
          for (var i = 0; i < mutedusers.length; i++) {
              if (cmd[1] == mutedusers[i]) {
                mutedusers.splice(i);
              }
          }
					bot.sendMessage({
                    to: channelID,
                    message: '> Succesvol ge-unmute',
					});
			}
            break;


      case 'plsdoge':

      bot.uploadFile({
        to: channelID,
        file: "./images/doge" + (Math.floor(Math.random() * 5)) + ".png",
      });
          break;

      case 'dogevid':
      bot.sendMessage({
        to: channelID,
        message: ""
      })
    }
     }
});
