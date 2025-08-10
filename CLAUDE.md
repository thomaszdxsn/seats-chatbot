# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a travel AI chatbot built with Next.js, designed to help users with travel-related queries including hotel bookings and flight reservations. The project is inspired by seats.aero/chat and follows Test-Driven Development (TDD) practices.

## Package Management

This project uses **pnpm** as the package manager. Always use pnpm commands:

```bash
pnpm install       # Install dependencies
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm start         # Start production server
pnpm lint          # Run ESLint
pnpm test          # Run tests
pnpm test:watch    # Run tests in watch mode
pnpm test:coverage # Run tests with coverage report
pnpm test:ci       # Run tests in CI mode

# Run specific test files
pnpm test src/app/page.test.tsx
pnpm test src/app/api/chat/route.test.ts
```

## Tech Stack & Dependencies

- **Framework**: Next.js 15 with App Router
- **AI Integration**: AI SDK 5.0 (`ai`) with AI SDK React (`@ai-sdk/react`) and Google Gemini provider (`@ai-sdk/google`)
- **Styling**: TailwindCSS v4 (with PostCSS plugin)
- **Language**: TypeScript with strict mode
- **Linting**: ESLint with Next.js configuration
- **Testing**: Jest with React Testing Library, includes MSW for future API mocking

## Architecture

### AI SDK 5.0 Integration
The project uses **AI SDK 5.0** with the new transport-based architecture:
- `useChat` hook from `@ai-sdk/react` with `DefaultChatTransport`
- Manual input state management (no more built-in input/handleInputChange)
- New `sendMessage` API that accepts `{ text: string }` objects
- Status-based loading states (`status === 'streaming'`)
- Message structure uses `parts` arrays with `{ type: 'text', text: string }` objects

### Current State
The application has full AI integration with:
- Complete chatbot UI implemented in `src/app/page.tsx` using AI SDK 5.0's transport pattern
- Google Gemini AI integration via API routes with streaming responses
- System prompt restricting conversations to travel-related topics only
- Error handling, loading states, and form validation
- Responsive design with dark mode support
- Comprehensive test coverage (22/22 tests passing)

### Key Files
- `src/app/page.tsx`: Main chatbot interface using AI SDK 5.0's `useChat` with `DefaultChatTransport`
- `src/app/api/chat/route.ts`: API route handling Gemini AI requests with `streamText`
- `src/app/layout.tsx`: Root layout with Geist fonts and metadata
- `src/app/page.test.tsx`: Comprehensive frontend tests with AI SDK mocking
- `src/app/api/chat/route.test.ts`: API endpoint tests with proper mock strategies
- `jest.setup.js`: Test environment setup with necessary polyfills (including `TransformStream`)

### Message Flow (AI SDK 5.0)
1. User input is managed by local React state (`useState`)
2. Form submission calls `sendMessage({ text: input })` from `useChat` hook
3. Transport sends POST request to `/api/chat` endpoint
4. API route validates environment variables and initializes Gemini model
5. System prompt ensures responses stay travel-focused
6. `streamText` generates streaming response via Gemini
7. Frontend receives real-time streaming updates through transport layer
8. Messages are rendered using `message.parts[].text` structure

### API Integration
- **Endpoint**: `POST /api/chat`
- **Model**: Google Gemini 2.5 Flash (configurable via environment)
- **Features**: Streaming responses with `streamText`, system prompts, comprehensive error handling
- **Authentication**: API key via `GOOGLE_GENERATIVE_AI_API_KEY` environment variable
- **Transport**: Uses AI SDK 5.0's transport-based architecture

## Environment Setup

Create `.env.local` with:
```bash
# Required: Get from https://aistudio.google.com/app/apikey  
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here

# Optional: Defaults to gemini-2.5-flash
GOOGLE_MODEL_NAME=gemini-2.5-flash

# Development proxy settings (only used in development environment)
# Useful for China mainland users to bypass network restrictions
HTTP_PROXY=http://127.0.0.1:8234
HTTPS_PROXY=http://127.0.0.1:8234
ALL_PROXY=socks5://127.0.0.1:8235

# Note: Proxy settings are automatically ignored in production builds
```

Available models: gemini-2.5-flash, gemini-2.5-pro, gemini-1.5-flash, gemini-1.5-pro

### Proxy Configuration (Development Only)

For China mainland users experiencing connection timeouts during development:

1. **Development Environment**: Proxy settings are automatically used when `NODE_ENV !== 'production'`
2. **Production Environment**: Proxy settings are ignored for security and performance
3. **Supported Protocols**: HTTP, HTTPS, and SOCKS5 proxies
4. **Configuration**: Set environment variables in `.env.local`:
   - `HTTP_PROXY=http://127.0.0.1:8234`
   - `HTTPS_PROXY=http://127.0.0.1:8234` 
   - `ALL_PROXY=socks5://127.0.0.1:8235`

The application automatically detects and uses the configured proxy only during development.

## Testing Architecture

### Test Environment
- Jest 30.0.5 with jsdom environment
- React Testing Library for component testing
- Custom polyfills for AI SDK compatibility (TransformStream, TextEncoder/Decoder)
- MSW available but temporarily disabled due to polyfill conflicts

### Key Test Patterns
- **AI SDK Mocking**: Mock `@ai-sdk/react` module and provide mock `useChat` return values
- **Transport Testing**: Mock transport objects when testing `useChat` configuration
- **Message Structure**: Use `{ id, role, parts: [{ type: 'text', text }] }` format for mock messages
- **Status Testing**: Use `status: 'streaming'` for loading state tests
- **API Testing**: Mock `streamText` with `mockImplementation` returning objects with `toTextStreamResponse`

### Running Tests
```bash
pnpm test                    # Run all tests
pnpm test:watch             # Run tests in watch mode  
pnpm test:coverage          # Generate coverage report
pnpm test src/app/page.test.tsx -t "specific test name"  # Run specific test
```

## Common Development Tasks

### Adding New AI Features
1. Modify the `SYSTEM_PROMPT` in `src/app/api/chat/route.ts`
2. Update message handling in `src/app/page.tsx` if needed
3. Add corresponding tests using the established mocking patterns

### Debugging AI SDK Issues
- Check `jest.setup.js` for required polyfills
- Ensure mock patterns match AI SDK 5.0 API (transport, sendMessage, status)
- Use `console.log` in tests to inspect message structures when debugging

### TypeScript Configuration
- Strict mode enabled with `@/*` alias pointing to `./src/*`
- Custom type definitions in `src/types/jest-dom.d.ts`
- ESLint configured to enforce ES6 imports (no `require()` statements)

## Import Aliases

TypeScript is configured with `@/*` alias pointing to `./src/*` directory.

## Current Status

✅ **Completed**:
- Full AI SDK 5.0 integration with transport architecture
- Google Gemini AI streaming responses  
- System prompt implementation for travel focus
- Comprehensive test coverage (22/22 tests passing)
- TypeScript and ESLint compliance
- Responsive UI with dark mode support

🚧 **Next Steps** (based on project requirements):
- Implement specific travel booking functionality
- Add hotel and flight search features
- Enhance system prompts for more sophisticated travel assistance
- Consider LangChain/LangGraph integration for complex workflows