# 现状

目前在 UI 发送一个消息，比如 `我需要8月20日从上海到东京的单程航班，PVG -> NRT`

实际 UI 的反应是这样的：

- 渲染"AI is thinking..."
- 渲染"No content"，然后立即消失
- 渲染 flight cards


# 期待

- 在 Bot 开启 tool calling 的时候，应该渲染提示文本，比如"Searching for flights..."
- 不要渲染"No content"然后突然消失
