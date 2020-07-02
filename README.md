# このBOTについて
このBOTは[welcome-hubot](https://github.com/0505Keitan/welcome-hubot)をDiscord版に修正＆変更したものです。

# 導入とか
[このページ見てください](0505keitan.com/docs/welcome-bot)

# Welcome-bot の機能 (scripts/chat.js)

- 「加入メッセージ登録 %USERNAME%さんいらっしゃい。ここは、%ROOMNAME% です。」のように発言すると「%USERNAME%さんいらっしゃい。ここは、%ROOMNAME% です。」をそのチャンネルの加入メッセージとして登録します。
- 加入メッセージの `%USERNAME%` は表示名またはユーザー名に、 `%ROOMNAME%` は #programming のようなチャンネル名に置換されます。
- 「加入メッセージ削除」のように発言すると、そのチャンネルの加入メッセージを解除します。