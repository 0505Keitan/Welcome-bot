'use strict';

const Client = require('discord.js');
const fs = require("fs");
console.log("module is loaded!")
const joinMessagesFileName = './join_messages.json';
let joinMessages = new Map(); // key: チャンネルID, value: 入室メッセージ

function saveJoinMessages() {
  fs.writeFileSync(
    joinMessagesFileName,
    JSON.stringify(Array.from(joinMessages)),
    'utf8'
  );
}

function loadJoinMessages() {
  try {
    const data = fs.readFileSync(joinMessagesFileName, 'utf8');
    joinMessages = new Map(JSON.parse(data));
  } catch (e) {
    console.log('loadJoinMessages Error:');
    console.log(e);
    console.log('空のjoinMessagesを利用します');
  }
}

async function cmd(msg) {
  loadJoinMessages();
  if(msg.author.bot) return;

  // 発言したチャンネルに入室メッセージを設定する
  if(msg.content.match(/^加入メッセージ登録 (.*)/i)){
    if(!msg.guild.systemChannel) msg.channel.send(':warning:このサーバではシステムのメッセージチャンネルが有効になっていません:warning:\n:warning:有効になってない場合、新規ユーザが加入してもメッセージが投稿されません:warning:');
    const parsed = msg.content.match(/^加入メッセージ登録 (.*)/);
    //console.log(parsed);
    if (parsed) {
      const joinMessage = parsed[1];
      const guildId = msg.guild.id;
      joinMessages.set(guildId, joinMessage);
      saveJoinMessages();
      msg.channel.send(`加入メッセージ:「${joinMessage}」を登録しました！`);
    }
  }

  // 発言したチャンネルの入室メッセージの設定を解除する
  if(msg.content.match(/^加入メッセージ削除/i)){
    if(!msg.guild.systemChannel) msg.channel.send(':warning:このサーバではシステムのメッセージチャンネルが有効になっていません:warning:\n:warning:有効になってない場合、新規ユーザが加入してもメッセージが投稿されません:warning:');
    const guildId = msg.guild.id;
    joinMessages.delete(guildId);
    saveJoinMessages();
    msg.channel.send(`加入メッセージを削除しました！`);
  }

  if(msg.content.match(/^w\? help/i)){
    const message = new Client.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Welcome bot')
      .setURL('https://0505keitan.com/docs/welcome-bot')
      .setDescription('加入メッセージ送信BOTの使い方')
      .addField('加入メッセージ登録 [MESSAGE]', 'サーバ加入時に送信させたいメッセージを登録/変更します。改行する場合は「\\n」を入力してください。')
      .addField('加入メッセージ削除', '変更した加入メッセージを削除します。')
      .setTimestamp()
      .setFooter('Made by 0505Keitan', 'https://1.bp.blogspot.com/-J3cnqcY8-6I/WMfCZGUDCEI/AAAAAAABCnY/y3vxhMqttW0u7aBiUhjBqyCl4_ifs_2EgCLcB/s400/yobidashi_bell1.png');
    msg.channel.send(message);
  }
}

async function join(newUser) {
  //部屋に入ったユーザーへの加入メッセージを案内 %USERNAME% はユーザー名に、%SERVERNAME% はサーバ名に置換

  //チャンネルのIDからチャンネル名を取得
  const guildId = newUser.guild.id;
  const guildName = newUser.guild.name;

  if(newUser.guild.systemChannel){
    if(joinMessages.has(guildId)){
      for (let [key, value] of joinMessages) {
        if (guildId === key) {
          let message = value
            .replace('%USERNAME%', newUser)
            .replace('%SERVERNAME%', guildName)
            .replace('\\n', '\n');
          newUser.guild.systemChannel.send(message);
        }
      }
    }else{
      newUser.guild.systemChannel.send(`${newUser}さんいらっしゃい。ここは、${guildName} です。`)
    }
  }
}

module.exports = {cmd, join};