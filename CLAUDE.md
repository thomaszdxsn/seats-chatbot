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

# Additional CI scripts
pnpm lint:fix        # Run ESLint with auto-fix
pnpm typecheck       # Run TypeScript type checking
pnpm test:affected   # Run tests for affected files

# Run specific test files
pnpm test src/app/page.test.tsx
pnpm test src/app/api/chat/route.test.ts
```

## CI/CD and Code Quality

### Pre-commit Hooks with Husky

The project uses **Husky** and **lint-staged** for automated pre-commit checks:

```bash
# Husky commands
pnpm prepare         # Initialize Husky hooks (runs automatically)
```

### Pre-commit Checks

The following checks run automatically on staged files before each commit:

- **ESLint**: Code linting with auto-fix for TypeScript/JavaScript files
- **TypeScript**: Type checking to catch type errors
- **Jest**: Run tests related to changed files
- **Prettier**: Code formatting for JSON, Markdown, and CSS files

### Quality Gates

All commits must pass:

1. ESLint rules (with auto-fix applied)
2. TypeScript compilation checks
3. Related test cases
4. Code formatting standards

Configuration files:

- `.husky/pre-commit`: Husky pre-commit hook configuration
- `lint-staged` configuration in `package.json`
- `.prettierrc`: Prettier formatting rules

## Tech Stack & Dependencies

- **Framework**: Next.js 15 with App Router
- **AI Integration**: AI SDK 5.0 (`ai`) with AI SDK React (`@ai-sdk/react`) and Google Gemini provider (`@ai-sdk/google`)
- **API Integrations**: SerpAPI for flight search, Google Gemini for AI capabilities
- **Styling**: TailwindCSS v4 (with PostCSS plugin)
- **UI Components**: Modular component architecture with markdown support via `react-markdown`
- **Language**: TypeScript with strict mode
- **Schema Validation**: Zod for runtime type checking
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
- **Flight Search Tool**: Integrated real-time flight search via SerpAPI with IATA code resolution
- **Message Actions**: Copy, edit, and resend functionality with editing flow
- System prompt restricting conversations to travel-related topics only
- Error handling, loading states, and form validation
- Responsive design with dark mode support
- Comprehensive test coverage (158/158 tests passing)

### Key Files

- `src/app/page.tsx`: Main chatbot interface using AI SDK 5.0's `useChat` with `DefaultChatTransport`
- `src/app/api/chat/route.ts`: API route handling Gemini AI requests with `streamText` and multilingual support
- `src/app/layout.tsx`: Root layout with Geist fonts and metadata
- `src/components/`: Modular UI components directory
  - `Message/`: Refactored message component directory (folder-based structure)
    - `Message.tsx`: Main message component (simplified from 447 to 80 lines)
    - `MessageActions.tsx`: Message action buttons (copy, edit, resend)
    - `FlightResults.tsx`: Flight search results display component
    - `MarkdownRenderer.tsx`: Markdown rendering with custom styling
    - `LoadingIndicator.tsx`: Animated loading dots component
    - `ToolRenderer.tsx`: AI tool output rendering component
    - `helpers.ts`: Utility functions for message processing
    - `types.ts`: TypeScript type definitions
    - `*.test.tsx`: Comprehensive test coverage for each component
  - `MessageList.tsx`: Message container with loading states and empty state
  - `ChatInput.tsx`: Input form component with validation and loading states
  - `ErrorDisplay.tsx`: Error handling component with retry functionality
- `src/lib/`: Utility functions directory
  - `proxy-config.ts`: Proxy configuration and Google AI client setup
  - `error-handler.ts`: Centralized error handling utilities
  - `message-converter.ts`: Message format conversion utilities
  - `system-prompt.ts`: Centralized system prompt configuration
  - `flight-tool.ts`: Unified flight search tool entry point
  - `flight-api.ts`: Unified flight API entry point
  - `hotel-tool.ts`: Hotel search tool entry point
  - `iata-resolver.ts`: Airport code and city name resolution utilities
  - `serpapi/`: SerpAPI provider implementations
    - `flight-tool.ts`: SerpAPI flight search tool
    - `flight-api.ts`: SerpAPI integration for real-time flight data
  - `pointsyeah/`: PointsYeah provider implementations (placeholder)
    - `flight-tool.ts`: PointsYeah flight search tool (placeholder)
    - `flight-api.ts`: PointsYeah flight API (placeholder)
    - `hotel-tool.ts`: PointsYeah hotel search tool (placeholder)
    - `hotel-api.ts`: PointsYeah hotel API (placeholder)
- `src/app/page.test.tsx`: Comprehensive frontend tests with AI SDK mocking
- `src/app/api/chat/route.test.ts`: API endpoint tests with proper mock strategies and multilingual testing
- `src/components/*.test.tsx`: Individual component tests with comprehensive coverage
- `jest.setup.js`: Test environment setup with necessary polyfills (including `TransformStream`)

### Message Flow (AI SDK 5.0)

1. User input is managed by local React state (`useState`)
2. Form submission calls `sendMessage({ text: input })` from `useChat` hook
3. Transport sends POST request to `/api/chat` endpoint
4. API route validates environment variables and initializes Gemini model
5. System prompt ensures responses stay travel-focused
6. **AI Tools**: Flight search tool automatically triggered for flight-related queries
7. `streamText` generates UI message streaming response via Gemini using `toUIMessageStreamResponse`
8. Frontend receives real-time streaming updates through transport layer
9. Messages are rendered using `message.parts[].text` structure with action buttons (copy, edit, resend)

### API Integration

- **Endpoint**: `POST /api/chat`
- **Model**: Google Gemini 2.5 Flash (configurable via environment)
- **Features**: UI message streaming with `toUIMessageStreamResponse`, system prompts, comprehensive error handling
- **AI Tools**:
  - Flight search tool (currently SerpAPI, PointsYeah placeholder ready)
  - Hotel search tool (PointsYeah placeholder implementation)
- **Authentication**: API key via `GOOGLE_GENERATIVE_AI_API_KEY` environment variable
- **Transport**: Uses AI SDK 5.0's transport-based architecture
- **Provider Configuration**: Switchable via `FLIGHT_API_PROVIDER` and `HOTEL_API_PROVIDER` environment variables

## Environment Setup

Create `.env.local` with:

```bash
# Required: Get from https://aistudio.google.com/app/apikey
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here

# Optional: Defaults to gemini-2.5-flash
GOOGLE_MODEL_NAME=gemini-2.5-flash

# Optional: SerpAPI key for flight search functionality (legacy provider)
# Get from https://serpapi.com/manage-api-key
SERPAPI_KEY=your_serpapi_key_here

# Note: PointsYeah API requires no API key - public access available

# Optional: Provider configuration
# FLIGHT_API_PROVIDER=serpapi  # Options: serpapi, pointsyeah (default: pointsyeah)
# HOTEL_API_PROVIDER=pointsyeah  # Options: pointsyeah (default: pointsyeah)

# === PROXY CONFIGURATION FOR CHINA MAINLAND USERS ===

# Option 1: Use China-specific proxy service (Recommended)
USE_CHINA_PROXY=true
# Optional: Custom China proxy URL (defaults to https://api.genai.gd.edu.kg/google)
# CHINA_PROXY_URL=https://your-custom-proxy.example.com/google

# Option 2: Traditional proxy settings (HTTP/HTTPS/SOCKS)
# Use these if you have your own proxy server or VPN
# HTTP_PROXY=http://127.0.0.1:8234
# HTTPS_PROXY=http://127.0.0.1:8234
# ALL_PROXY=socks5://127.0.0.1:8235

# Note: Proxy settings only work in development environment
# In production (Vercel deployment), proxy settings are ignored for performance
```

Available models: gemini-2.5-flash, gemini-2.5-pro, gemini-1.5-flash, gemini-1.5-pro

### Proxy Configuration for China Mainland Users

For users in China experiencing connection timeouts when accessing Google Gemini API:

#### Option 1: China-Specific Proxy Service (Recommended)

1. Set `USE_CHINA_PROXY=true` in your `.env.local`
2. The app uses `https://api.genai.gd.edu.kg/google` as the default proxy
3. Optionally customize with `CHINA_PROXY_URL=your-proxy-url`

#### Option 2: Traditional Proxy (VPN/SOCKS/HTTP)

1. **Supported Protocols**: HTTP, HTTPS, and SOCKS5 proxies
2. **Configuration**: Set environment variables in `.env.local`:
   - `HTTP_PROXY=http://127.0.0.1:8234`
   - `HTTPS_PROXY=http://127.0.0.1:8234`
   - `ALL_PROXY=socks5://127.0.0.1:8235`

#### Option 3: Custom Cloudflare Workers Proxy

You can set up your own Cloudflare Workers proxy:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    url.host = 'generativelanguage.googleapis.com';
    return fetch(new Request(url, request));
  },
};
```

**Important**: Proxy configurations only work in development environment (`NODE_ENV !== 'production'`). In production deployments (such as Vercel), proxy settings are automatically disabled for performance and security reasons.

The application automatically detects the appropriate proxy configuration and logs the chosen method for debugging during development.

## Multilingual Support

The application includes comprehensive multilingual support with intelligent language detection:

### Language Detection & Response

- **Automatic Language Matching**: AI automatically responds in the same language as the user's input
- **Supported Languages**: Chinese (中文), English, and other languages
- **Native Fluency**: Maintains natural, native-level fluency in the chosen language

### Language-Specific Features

- **Redirect Messages**: Contextually appropriate redirect messages for non-travel topics:
  - English: "I'm a travel assistant and can only help with travel-related questions. How can I assist you with your travel plans today?"
  - Chinese: "我是旅行助手，只能帮助解答旅行相关的问题。请问今天我可以如何协助您的旅行计划呢？"

### Implementation Details

- Language detection is handled through the system prompt in `src/app/api/chat/route.ts`
- No additional libraries or language detection APIs required
- Leverages Google Gemini's built-in multilingual capabilities

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
- **API Testing**: Mock `streamText` with `mockImplementation` returning objects with `toUIMessageStreamResponse`

### Running Tests

```bash
pnpm test                    # Run all tests (158 tests)
pnpm test:watch             # Run tests in watch mode
pnpm test:coverage          # Generate coverage report
pnpm test src/app/page.test.tsx -t "specific test name"  # Run specific test
pnpm test src/components/Message/  # Run all Message component tests (79 tests)
```

## Common Development Tasks

### Adding New AI Features

1. Modify the `SYSTEM_PROMPT` in `src/lib/system-prompt.ts`
2. Add new AI tools in `src/lib/` following the pattern of `flight-tool.ts`
3. Register tools in `src/app/api/chat/route.ts` by importing and adding to `tools` array
4. Update message handling in `src/app/page.tsx` if needed
5. Add tool output rendering in `src/components/Message/ToolRenderer.tsx`
6. Add corresponding tests using the established mocking patterns

### Working with Message Components

The Message component has been refactored into a modular structure:

- **Main component**: `Message.tsx` - orchestrates other components
- **Sub-components**: Each handles specific functionality (actions, rendering, loading)
- **Helper functions**: Extracted into `helpers.ts` with comprehensive tests
- **Type safety**: All components use proper TypeScript types, avoid `any` types
- **Image handling**: Uses standard `<img>` tags (not Next.js `<Image>`) for better test compatibility

### Working with API Providers

The project uses a modular API provider architecture:

- **Provider Structure**: Each API provider has its own subfolder (`serpapi/`, `pointsyeah/`)
- **Unified Interface**: Main entry points (`flight-tool.ts`, `hotel-tool.ts`) provide consistent APIs
- **Environment Configuration**: Switch providers via environment variables
- **Adding New Providers**: Create new subfolder with matching file structure and interface
- **Placeholder Pattern**: PointsYeah implementations serve as templates for future providers

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
- System prompt implementation for travel focus with multilingual support
- Comprehensive test coverage (158/158 tests passing)
- TypeScript and ESLint compliance
- Responsive UI with dark mode support

🚧 **Next Steps** (based on project requirements):

- Enhance flight search with more filters and options
- Add hotel search and booking functionality
- Implement user preferences and session management
- Add travel itinerary planning features
- Consider LangChain/LangGraph integration for complex workflows
