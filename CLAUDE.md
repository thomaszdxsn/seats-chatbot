# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a travel AI chatbot built with Next.js, designed to help users with travel-related queries including hotel bookings and flight reservations. The project is inspired by seats.aero/chat and follows Test-Driven Development (TDD) practices.

## Package Management

This project uses **pnpm** as the package manager. Always use pnpm commands:

```bash
pnpm install     # Install dependencies
pnpm dev         # Start development server
pnpm build       # Build for production
pnpm start       # Start production server
pnpm lint        # Run ESLint
```

## Tech Stack & Dependencies

- **Framework**: Next.js 15 with App Router
- **AI Integration**: AI SDK (`ai`) with Google Gemini provider (`@ai-sdk/google`)
- **Styling**: TailwindCSS v4 (with PostCSS plugin)
- **Language**: TypeScript with strict mode
- **Linting**: ESLint with Next.js configuration

## Tech Requirements

- Use english as UI language, not chinese

## Architecture

### Current State
The application is currently in initial setup phase with:
- Basic chatbot UI implemented in `src/app/page.tsx` as a client component
- Placeholder AI responses (AI integration not yet implemented)
- Message state management using React useState
- Responsive design with dark mode support

### Key Files
- `src/app/page.tsx`: Main chatbot interface with message handling
- `src/app/layout.tsx`: Root layout with Geist fonts
- `PRPs/1-setup.md`: Original project requirements document (Chinese)

### Message Flow
The chatbot uses a simple message array structure:
```typescript
Array<{ role: 'user' | 'assistant'; content: string }>
```

## Environment Setup

Create `.env.local` with:
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

## Next Steps (Based on PRPs)

1. Implement actual AI integration with Google Gemini
2. Add travel-specific functionality (hotel booking, flight queries)
3. Evaluate need for additional frameworks like LangChain/LangGraph
4. Implement comprehensive testing suite following TDD approach

## Import Aliases

TypeScript is configured with `@/*` alias pointing to `./src/*` directory.

## Development Notes

- The UI is fully responsive and supports dark mode
- All user-facing text is in English
- Loading states are implemented with animated dots
- Form submission prevents empty messages
- Error handling is basic (console.error only)
