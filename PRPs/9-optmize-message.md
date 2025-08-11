# 现状

目前是一个传统的 chatbot UI ，可以正常显示用户和 bot 的对话

# 期待

- 每一条消息，在 hover 之后都能在下面显示若干按钮
- 比如 copy, edit, resend
  - edit/resent 只在 user 的消息上显示
  - edit 点击以后会将内容复制到输入框，用户输入以后会重置到被 edit 的那一条 messages 的位置。比如已经回答 5 条消息了，用户选择编辑第 2 条，那么就以第 2 条重新开始，让 bot 应答
