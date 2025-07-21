# Ryan's Sports Challenge 2026

A comprehensive multi-sport fantasy league platform featuring dynamic team drafting, real-time performance tracking, and competitive challenges across 18+ sports.

## Features

- **Multi-Sport Fantasy League**: Draft teams/players across NFL, NBA, Golf, Tennis, F1, College Sports, and more
- **Real-Time Performance Tracking**: Live scoring updates with authentic CSV data integration
- **Strategic Wild Card System**: Use wild cards to maximize points across different sport categories
- **Interactive Dashboard**: Player-specific stats showing total points, possible points, completed/upcoming events
- **Comprehensive Leaderboard**: Real-time rankings with detailed performance breakdowns
- **Draft Matrix**: Visual representation of all player picks across sports
- **Event Timeline**: Complete schedule with completion status and point structures

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query for server state
- **Authentication**: Replit OAuth (removed for public demo)
- **Build Tool**: Vite with hot module replacement

## Project Structure

```
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities and configurations
├── server/              # Express.js backend
│   ├── services/        # Business logic and CSV processing
│   └── storage.ts       # Database operations
├── shared/              # Shared types and schemas
│   └── schema.ts        # Drizzle database schema
└── attached_assets/     # CSV data files
```

## Key Features

### Dashboard Statistics
- **Total Points**: Current earned points from completed events
- **Possible Points**: Maximum potential points from all draft picks
- **Completed Events**: Number of finished events based on player's picks
- **Upcoming Events**: Number of future events in player's draft

### Real Data Integration
- Authentic CSV data from Ryan's Sports Challenge 2026
- 16 players with complete draft picks and performance tracking
- 25 events across 18+ sports with accurate completion status
- Point calculations matching original spreadsheet data

### Player Performance Tracking
- Individual player stats and pick analysis
- Sport category breakdown (Cool, Neutral, Wild Card)
- Event completion tracking with timeline visualization
- Strategic wild card usage monitoring

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up Database**:
   ```bash
   npm run db:push
   ```

3. **Seed Database with CSV Data**:
   - Navigate to `/api/seed-database` endpoint to import CSV data

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Access Application**:
   - Open browser to `http://localhost:5000`
   - Select any player from dropdown to view their performance

## API Endpoints

- `GET /api/leaderboard/real` - Real-time leaderboard with CSV data
- `GET /api/player/:name/stats` - Player-specific performance statistics
- `GET /api/draft/complete` - Complete draft data with all picks
- `GET /api/events` - All sports events with completion status
- `GET /api/sports` - Available sports with categories

## Data Sources

The application uses authentic data from Ryan's Sports Challenge 2026:
- **Draft Data**: Complete player picks across all sports
- **Points Data**: Real performance scores and totals
- **Schedule Data**: Event timeline with completion status

## Live Demo

This is a public demo version allowing anyone to explore different players' performance data and draft strategies without authentication requirements.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.