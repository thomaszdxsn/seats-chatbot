# 现状

目前 chatbot 的组件太多代码，应该将它们拆分成更小的组件。

其中 bot 返回的 message 可能是 markdown 格式，目前并不能正确 preview

# 期待

- 拆分组件： 比如 `<Message>` , `<MessageList>` , `<Input>` ....
- 拆分 route.ts 分成多个独立的函数，每个函数可以单独测试
- 可以对 markdown 进行预览
