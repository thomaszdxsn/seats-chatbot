# 目前碰到的问题

在前端发送一个 message 之后，后端的 API 发生了如下的情况

首先是

```javascript
{
  result: DefaultStreamTextResult {
    _totalUsage: DelayedPromise {
      status: [Object],
      _resolve: undefined,
      _reject: undefined
    },
    _finishReason: DelayedPromise {
      status: [Object],
      _resolve: undefined,
      _reject: undefined
    },
    _steps: DelayedPromise {
      status: [Object],
      _resolve: undefined,
      _reject: undefined
    },
    output: undefined,
    includeRawChunks: false,
    tools: undefined,
    addStream: [Function: addStream],
    closeStream: [Function: close],
    baseStream: ReadableStream { locked: false, state: 'readable', supportsBYOB: false }
  }
}
```

然后变成超时

```javascript
[Error [AI_RetryError]: Failed after 3 attempts. Last error: Cannot connect to API: Connect Timeout Error (attempted addresses: 142.250.217.106:443, 142.251.33.74:443, 142.250.73.138:443, 142.250.73.74:443, 142.250.69.170:443, 142.250.73.106:443, 142.250.217.74:443, 142.251.215.234:443, timeout: 10000ms)] {
  cause: undefined,
  reason: 'maxRetriesExceeded',
  errors: [Array],
  lastError: [Error [AI_APICallError]: Cannot connect to API: Connect Timeout Error (attempted addresses: 142.250.217.106:443, 142.251.33.74:443, 142.250.73.138:443, 142.250.73.74:443, 142.250.69.170:443, 142.250.73.106:443, 142.250.217.74:443, 142.251.215.234:443, timeout: 10000ms)] {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse',
    requestBodyValues: {
      generationConfig: [Object],
      contents: [Array],
      systemInstruction: [Object],
      safetySettings: undefined,
      tools: undefined,
      toolConfig: undefined,
      cachedContent: undefined
    },
    statusCode: undefined,
    responseHeaders: undefined,
    responseBody: undefined,
    isRetryable: true,
    data: undefined,
    [cause]: [Error [ConnectTimeoutError]: Connect Timeout Error (attempted addresses: 142.250.217.106:443, 142.251.33.74:443, 142.250.73.138:443, 142.250.73.74:443, 142.250.69.170:443, 142.250.73.106:443, 142.250.217.74:443, 142.251.215.234:443, timeout: 10000ms)] {
      code: 'UND_ERR_CONNECT_TIMEOUT'
    }
  }
}
```

请查看我的 @src/app/api/chat/route.ts 文件，它已经加入了 proxy 相关的代码。

我的情况是：我在中国大陆，使用的网络可能不能直接连接 Google API，所以需要使用代理服务器来访问 Google API。

# Debug

请进行 debug，帮我看一下到底是什么原因，为什么 proxy 相关的代码不生效？

是否有其它的解决方式，可以去网上搜索有没有人碰到过类似的问题，有什么更好的解决方案？

请思考一下原因, ultra think it。然后提供解决方案。

然后，请确保 API 返回的 response 可以被 UI 正确渲染出来。
