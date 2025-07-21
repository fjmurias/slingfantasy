# replit.md

## Overview

This is a multi-sport fantasy league application called "Ryan's Sports Challenge 2026" built with a modern full-stack architecture. The application allows users to participate in a comprehensive fantasy league spanning 18+ sports including NFL, NBA, Golf, Tennis, F1, and more. Users can draft teams/players, track scoring across events, use strategic wild card picks, and compete in real-time leaderboards.

**Key Achievement (January 2025)**: Successfully integrated authentic CSV data from Ryan's Sports Challenge 2026, replacing all mock data with real player performance metrics. The application now displays actual performance data including Fern's current position (15th place, 49.4 points) and complete leaderboard standings with John leading at 193.4 points.

**Critical Fix (January 2025)**: Resolved scoring calculation discrepancies by using totals directly from CSV data instead of calculating from individual events, ensuring 100% accuracy with source spreadsheet.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

- **Real Data Integration**: Successfully implemented CSV processor service that imports actual Draft, Points, and Schedule data from Ryan's Sports Challenge 2026
- **Nomenclature Update**: Changed "Fruity" category to "Wild Card" across entire codebase (frontend, backend, CSS styling)  
- **Performance Tracking**: Created comprehensive leaderboard showing authentic player rankings with Fern at 15th place (49.4 points, 6 completed events)
- **Individual Player Focus**: Built detailed player performance components showing Fern's actual picks, completed events, and wild card usage
- **API Endpoints**: Added real-time CSV data endpoints (/api/player/Fern/data, /api/leaderboard/real, /api/draft/complete, /api/schedule/complete) for authentic performance metrics
- **Scoring Accuracy**: Fixed critical calculation errors by using CSV totals directly, ensuring perfect match with spreadsheet data (Fern: 49.4 pts, John: 193.4 pts)
- **Complete Draft Board**: Built comprehensive draft page showing all 16+ players with their picks categorized by Cool/Neutral/Wild Card with accurate completion status
- **Schedule Timeline**: Created detailed schedule page showing all sports events with completion indicators, removing duplicates and using master data source
- **Duplicate Removal**: Fixed CSV processing to eliminate duplicate events and ensure accurate sport completion tracking across all pages

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React-based SPA built with Vite, using TypeScript and Tailwind CSS
- **Backend**: Express.js server with TypeScript, using Drizzle ORM for database operations
- **Database**: PostgreSQL with Neon serverless connection
- **Authentication**: Replit's built-in OAuth system with session management
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **State Management**: TanStack Query for server state and caching

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript in SPA mode
- **Build Tool**: Vite with hot module replacement in development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library built on Radix UI
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query for server state, local state with React hooks

### Backend Architecture
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL
- **Authentication**: Passport.js with OpenID Connect for Replit OAuth
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **API Design**: RESTful endpoints with consistent error handling
- **Data Import**: CSV parsing service for initial data seeding

### Database Schema
The application uses a PostgreSQL database with the following core entities:
- **Users**: Authentication and profile data
- **Leagues**: Multi-sport league configuration
- **Sports**: Individual sport definitions with categories (Cool, Neutral, Fruity)
- **Events**: Specific sporting events within each sport
- **League Participants**: User membership in leagues
- **Draft Picks**: User selections for each sport/event
- **Scoring Results**: Point calculations for completed events
- **Sessions**: Authentication session storage

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit OAuth, sessions stored in PostgreSQL
2. **League Management**: Users can create/join leagues, with participant tracking
3. **Draft System**: Sequential drafting across multiple sports with wild card mechanics
4. **Event Management**: Sports events are tracked with real-time scoring updates
5. **Leaderboard Calculation**: Point totals calculated from completed events and cached
6. **Real-time Updates**: TanStack Query provides optimistic updates and background refresh

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection with WebSocket support
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **passport & openid-client**: Authentication with Replit OAuth
- **express-session**: Session management with PostgreSQL storage

### UI & Styling
- **@radix-ui/react-***: Headless UI primitives for accessibility
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe component variants

### Development Tools
- **vite**: Fast build tool with HMR
- **typescript**: Type safety across the stack
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Deployment Strategy

### Development Environment
- Runs on Replit with integrated database provisioning
- Vite dev server with Express API in middleware mode
- Hot module replacement for rapid development
- Environment variables managed through Replit secrets

### Production Build
- Frontend: Vite builds optimized React bundle
- Backend: esbuild creates single-file Node.js bundle
- Database: Drizzle migrations applied via `db:push` command
- Static assets served from Express with SPA fallback

### Environment Configuration
- **DATABASE_URL**: Neon PostgreSQL connection string
- **SESSION_SECRET**: Secure session signing key
- **REPL_ID & ISSUER_URL**: Replit OAuth configuration
- **REPLIT_DOMAINS**: Allowed domains for OAuth callbacks

The application is designed to run seamlessly on Replit's infrastructure with built-in database provisioning, OAuth integration, and deployment capabilities. The modular architecture supports both development and production workflows with clear separation of concerns.