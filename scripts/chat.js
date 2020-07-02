'use strict';

const {Client, RichEmbed} = require('discord.js');
const client = new Client();
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
    msg.channel.send(`Welcome-botの使い方に関しては <https://0505keitan.com/docs/welcome-bot> を参照してください。`);
  }
}

async function join(newUser) {
  //部屋に入ったユーザーへの加入メッセージを案内 %USERNAME% はユーザー名に、%ROOMNAME% はサーバ名に置換

  //チャンネルのIDからチャンネル名を取得
  const guildId = newUser.guild.id;
  const guildName = newUser.guild.name;

  if(newUser.guild.systemChannel){
    if(joinMessages.has(guildId)){
      for (let [key, value] of joinMessages) {
        if (guildId === key) {
          let message = value
            .replace('%USERNAME%', newUser)
            .replace('%SERVERNAME%', guildName);
          newUser.guild.systemChannel.send(message);
        }
      }
    }else{
      newUser.guild.systemChannel.send(`${newUser}さんいらっしゃい。ここは、${guildName} です。`)
    }
  }
}

module.exports = {cmd, join};