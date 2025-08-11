import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

export interface ProxyConfiguration {
  needsProxy: boolean;
  chinaProxyUrl?: string;
  traditionalProxy?: string;
}

export function getProxyConfiguration(): ProxyConfiguration {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Only enable proxy in development environment (not in production/Vercel)
  const needsProxy = isDevelopment && (process.env.USE_CHINA_PROXY === 'true' || !!process.env.CHINA_PROXY_URL);
  const chinaProxyUrl = process.env.CHINA_PROXY_URL || 'https://api.genai.gd.edu.kg/google';
  
  // Traditional proxy configuration (for VPN/SOCKS/HTTP proxies) - development only
  const traditionalProxy = isDevelopment ? (process.env.HTTP_PROXY || process.env.HTTPS_PROXY || process.env.ALL_PROXY) : undefined;

  return {
    needsProxy,
    chinaProxyUrl,
    traditionalProxy,
  };
}

export function createGoogleAIClient(apiKey: string, proxyConfig: ProxyConfiguration) {
  console.log('Proxy configuration:', {
    needsProxy: proxyConfig.needsProxy,
    chinaProxyUrl: proxyConfig.needsProxy ? proxyConfig.chinaProxyUrl : 'not used',
    traditionalProxy: proxyConfig.traditionalProxy ? 'configured' : 'not configured'
  });

  if (proxyConfig.needsProxy && proxyConfig.chinaProxyUrl) {
    // Option 1: Use China-specific proxy service (recommended for China mainland users)
    console.log('Using China proxy service:', proxyConfig.chinaProxyUrl);
    return createGoogleGenerativeAI({
      apiKey,
      baseURL: proxyConfig.chinaProxyUrl + '/v1beta'
    });
  } else if (proxyConfig.traditionalProxy) {
    // Option 2: Use traditional proxy (HTTP/HTTPS/SOCKS)
    console.log('Using traditional proxy:', proxyConfig.traditionalProxy);
    
    const customFetch = (url: string | URL | Request, init?: RequestInit) => {
      let agent;
      if (proxyConfig.traditionalProxy!.startsWith('socks://') || 
          proxyConfig.traditionalProxy!.startsWith('socks4://') || 
          proxyConfig.traditionalProxy!.startsWith('socks5://')) {
        agent = new SocksProxyAgent(proxyConfig.traditionalProxy!);
      } else {
        agent = new HttpsProxyAgent(proxyConfig.traditionalProxy!);
      }

      return fetch(url, {
        ...init,
        // @ts-expect-error - Node.js specific agent property
        agent
      });
    };

    return createGoogleGenerativeAI({
      apiKey,
      fetch: customFetch
    });
  } else {
    // Option 3: Direct connection (no proxy)
    console.log('Using direct connection (no proxy)');
    return createGoogleGenerativeAI({
      apiKey
    });
  }
}