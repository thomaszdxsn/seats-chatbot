import '@testing-library/jest-dom'
import 'whatwg-fetch'

// Polyfill for fetch and related APIs
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Ensure Response is available globally
global.Response = Response
global.Request = Request

// Mock TransformStream for AI SDK
global.TransformStream = class {
  constructor(transformer) {
    this.readable = new ReadableStream()
    this.writable = new WritableStream()
  }
}

// Note: MSW setup temporarily disabled due to polyfill conflicts
// Will be enabled when AI integration is implemented

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
})