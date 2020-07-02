require('dotenv').config();
const {Client, RichEmbed} = require('discord.js');
const client = new Client();
const cmd = require('./scripts/chat.js');

client.on('uncaughtException', function(err) {
  console.log(err);
});

client.on('error', error => {
  console.log(error);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activity: {
      name: `β0.1 | w? help`
    },
    status: 'online'
  });
});

client.on('guildMemberAdd', async newUser => {
  cmd.join(newUser);
});

client.on('message', async msg => {
  cmd.cmd(msg);
});

client.login(process.env.BOT_TOKEN);