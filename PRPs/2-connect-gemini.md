# Explorer

> 请先阅读如下的资料

- ai-sdk(google): https://ai-sdk.dev/docs/introduction
  - 希望可以使用 gemini 2.5 flash 这个 model
- ai-sdk UI: https://ai-sdk.dev/docs/ai-sdk-ui
- ai-sdk Core: https://ai-sdk.dev/docs/ai-sdk-core



# Plan

我希望可以参考 ai-sdk 的文档，来连接 Google Gemini AI。

希望可以通过 System Prompt 的方式（或者其它的方式？），限制对话的内容，对话的内容应该局限于这个产品本身相关的内容。如果用户提问其它方面的问题，应该拒绝回答用户。

通过 env 的方式提供 API_KEY 和 MODEL_NAME，例如：

```bash
export GEMINI_API_KEY=your_api_key
export GEMINI_MODEL_NAME=gemini-2.5-flash
```
