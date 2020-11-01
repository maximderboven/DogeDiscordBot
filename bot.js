/* Made by Maxim D. & Alexie C.
* in use and aangepast voor pepe discord server
*
* Todolist:
* 1. bot doesnt barks in call
* 2.
*/


//nodig voor werking
var Discord = require('discord.io');
//var Discord = require('discord.js');
var logger = require('winston');
//var auth = require('./auth.json');
var fs = require('fs');


//logs in console server
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
var bot = new Discord.Client({
   token: process.env.token,
   autorun: true
});



//opstarten bot
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
	  bot.setPresence( {game: {name:"dogehelp"}} );
});



//muted users opslaan in array
var mutedusers = ["000000"];
//Doge videos uit tekstbestand halen
var links = fs.readFileSync("./data-files/doge_videos.txt", "utf-8").split("\n");

//simulate: "Doge is typing....."
//bot.simulateTyping("400647401473310731");




// bij elke bericht (commando's:)
bot.on('message', function (user, userID, channelID, message, evt) {

		//commando eruit halen
		var cmd = message.toLowerCase().split(" ");

		//Gemute mensen hun berichten blokkeren:
		for (var i = 0; i < mutedusers.length; i++)
		{
			if (userID == mutedusers[i])
			{
        //bericht verzenden naar log kanaal
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
			case 'dogehelp':
					bot.sendMessage({
                    to: channelID,
                    message: '> **Commandos werken enkel in #botchannel **\n> *dogeimg* - geeft een foto van doge weer\n> *dogevid* - geeft een video van doge weer\n> *dogeinfo* - geeft info over de bot weer\n> *dogebark* - laat de hond blaffen\n> *dogemute gebruikerID* - mute een gebruiker\n> *dogeunmute gebruikerID* - unmute een gebruiker',
                });
            break;


      //mute function (enkel met delete van berichten / users trollen)
			case 'dogemute':
			if (userID == 249517085133111296 || userID == 439520489031860224)
			{

					mutedusers.push(cmd[1]);

					bot.sendMessage({
                    to: channelID,
                    message: '> Succesvol gemute',
					});

			}
      break;


      //unmute
			case 'dogeunmute':
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


      // Laat random doge foto zien
      case 'dogeimg':
      bot.uploadFile({
        to: channelID,
        file: "./images/doge" + (Math.floor(Math.random() * 5)) + ".png",
      });
          break;


      // Laat random doge video zien
      case 'dogevid':
      bot.sendMessage({
        to: channelID,
        message: links[(Math.floor(Math.random() * links.length))],
      });
      break;




      // Doge info
      case 'dogeinfo':
      bot.sendMessage({
        to: channelID,
        message: "> **Dogebot 1.1**\n> *created by Maxim Derboven & Alexie Chaerle*",
      });
      break;




      // Bot komt in call en blaft
      case 'dogebark':
      var voiceChannelID = "400647401473310733";
      bot.joinVoiceChannel(voiceChannelID, function(error, events) {
        if (error) return console.error(error);
        bot.getAudioContext(voiceChannelID, function(error, stream) {
          if (error) return console.error(error);
          fs.createReadStream('./bark.mp3').pipe(stream, {end: false});
          stream.on('done', function() {
             //Handle
          });
        });
      });
      break;



      //reload
      case 'dogereload':
          bot.sendMessage({
            to: channelID,
          message: "> **/!\\ RELOAD WERKT EVEN NIET**",
          });
      break;




      } // switch dicht doen
   } // voor te controleren in enkel botchannel
}); // laten staan voor bot.on
