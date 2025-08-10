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
```

## Tech Stack & Dependencies

- **Framework**: Next.js 15 with App Router
- **AI Integration**: AI SDK (`ai`) with Google Gemini provider (`@ai-sdk/google`)
- **Styling**: TailwindCSS v4 (with PostCSS plugin)
- **Language**: TypeScript with strict mode
- **Linting**: ESLint with Next.js configuration
- **Testing**: Jest with React Testing Library and MSW for API mocking

## Architecture

### Current State
The application now has full AI integration with:
- Complete chatbot UI implemented in `src/app/page.tsx` using AI SDK's useChat hook
- Google Gemini AI integration via API routes
- Real-time streaming responses from Gemini 2.5 Flash
- System prompt restricting conversations to travel-related topics
- Error handling and loading states
- Responsive design with dark mode support

### Key Files
- `src/app/page.tsx`: Main chatbot interface using AI SDK's useChat hook
- `src/app/api/chat/route.ts`: API route handling Gemini AI requests
- `src/app/layout.tsx`: Root layout with Geist fonts
- `PRPs/1-setup.md`: Original project requirements document (Chinese)
- `PRPs/2-connect-gemini.md`: Gemini integration requirements

### Message Flow
1. User input is managed by AI SDK's useChat hook
2. Messages are sent to `/api/chat` endpoint via POST request
3. API route validates environment variables and initializes Gemini model
4. System prompt ensures responses stay travel-focused
5. Gemini generates streaming response with travel assistance
6. Frontend receives and displays real-time streaming text

### API Integration
- **Endpoint**: `POST /api/chat`
- **Model**: Google Gemini 2.5 Flash (configurable)
- **Features**: Streaming responses, system prompts, error handling
- **Authentication**: API key via environment variables

## Environment Setup

Create `.env.local` with:
```bash
# Required: Get from https://aistudio.google.com/app/apikey  
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Defaults to gemini-2.5-flash
GEMINI_MODEL_NAME=gemini-2.5-flash
```

Available models: gemini-2.5-flash, gemini-2.5-pro, gemini-1.5-flash, gemini-1.5-pro

## Next Steps (Based on PRPs)

1. ✅ ~~Implement AI integration with Google Gemini~~
2. ✅ ~~Add system prompts to restrict conversation scope~~  
3. Add travel-specific functionality (hotel booking, flight queries)
4. Evaluate need for additional frameworks like LangChain/LangGraph
5. Implement comprehensive testing suite following TDD approach

## Import Aliases

TypeScript is configured with `@/*` alias pointing to `./src/*` directory.

## Testing

### Test Structure
- Tests are located in `src/__tests__/` and alongside components (`.test.tsx`)
- Custom test utilities in `src/__tests__/utils/test-utils.tsx`
- MSW handlers for API mocking in `src/__tests__/mocks/`

### Key Test Files
- `src/app/page.test.tsx`: Comprehensive tests for the main chatbot component
- `jest.config.js`: Jest configuration with Next.js integration
- `jest.setup.js`: Global test setup and mocks

### Test Coverage
Current test coverage includes:
- Component rendering and UI elements
- User interactions (typing, clicking, form submission)
- Message state management
- Loading states and form validation
- API mocking setup for future AI integration

## Development Notes

- The UI is fully responsive and supports dark mode
- All user-facing text is in English
- Loading states are implemented with animated dots
- Form submission prevents empty messages
- Error handling is basic (console.error only)
- Comprehensive test suite follows TDD practices
