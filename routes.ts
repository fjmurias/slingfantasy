import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertLeagueSchema,
  insertLeagueParticipantSchema,
  insertDraftPickSchema,
  insertScoringResultSchema,
  leagues,
  leagueParticipants,
  sports,
  events,
  draftPicks,
  scoringResults
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
// import { dataImport } from "./services/dataImport"; // Unused for now
import { csvProcessor } from "./services/csvProcessor";
import { LeagueMapper } from "./services/leagueMapper";
import { DatabaseSeeder } from "./services/databaseSeeder";

export async function registerRoutes(app: Express): Promise<Server> {
  // Players endpoint - get all player names from database (NO AUTH NEEDED)
  app.get('/api/players', async (req, res) => {
    try {
      const participants = await db.select({ playerName: leagueParticipants.playerName })
        .from(leagueParticipants)
        .orderBy(leagueParticipants.playerName);
      
      const playerNames = participants.map(p => p.playerName);
      res.json(playerNames);
    } catch (error) {
      console.error("Error fetching players:", error);
      res.status(500).json({ message: "Failed to fetch players" });
    }
  });

  // Auth middleware
  await setupAuth(app);

  // Auth routes - Public demo version
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // For demo purposes, return a mock user
      const mockUser = {
        id: "demo-user",
        email: "demo@example.com",
        firstName: "Demo",
        lastName: "User"
      };
      res.json(mockUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Data import route (for initial setup)
  app.post('/api/import-csv', async (req: any, res) => {
    try {
      // await dataImport.importFromCSV(); // Commented out for now
      res.json({ message: "Data import disabled" });
    } catch (error) {
      console.error("Error importing data:", error);
      res.status(500).json({ message: "Failed to import data" });
    }
  });

  // Database seeding route - populate database with CSV data
  app.post('/api/seed-database', async (req: any, res) => {
    try {
      const seeder = new DatabaseSeeder();
      await seeder.seedDatabase();
      res.json({ message: "Database seeded successfully with CSV data!" });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ message: "Failed to seed database", error: (error as Error).message });
    }
  });

  // League routes - public access for main league
  app.get('/api/leagues', async (req, res) => {
    try {
      const leagues = await storage.getLeaguesByUser("system");
      res.json(leagues);
    } catch (error) {
      console.error("Error fetching leagues:", error);
      res.status(500).json({ message: "Failed to fetch leagues" });
    }
  });

  app.get('/api/leagues/:id', async (req, res) => {
    try {
      const leagueId = parseInt(req.params.id);
      const league = await storage.getLeague(leagueId);
      
      if (!league) {
        return res.status(404).json({ message: "League not found" });
      }

      res.json(league);
    } catch (error) {
      console.error("Error fetching league:", error);
      res.status(500).json({ message: "Failed to fetch league" });
    }
  });

  // Sports routes - from database
  app.get('/api/sports', async (req, res) => {
    try {
      const sportsData = await db.select().from(sports).orderBy(sports.name);
      res.json(sportsData);
    } catch (error) {
      console.error("Error fetching sports:", error);
      res.status(500).json({ message: "Failed to fetch sports" });
    }
  });

  // Player stats endpoint - get stats for a specific player
  app.get('/api/player/:playerName/stats', async (req, res) => {
    try {
      const playerName = req.params.playerName;
      
      // Get player's picks from CSV data directly
      const draftData = await csvProcessor.processDraftData();
      const leaderboardData = await csvProcessor.getLeaderboard();
      
      console.log(`Available players in draft data:`, draftData.map((p: any) => p.playerName).filter((name: string, index: number, arr: string[]) => arr.indexOf(name) === index));
      console.log(`Looking for player: ${playerName}`);
      
      // Get all events with their status
      const eventsData = await db.select().from(events);
      
      // Group picks by player
      const draftByPlayer: { [player: string]: any[] } = {};
      draftData.forEach((pick: any) => {
        if (!draftByPlayer[pick.playerName]) {
          draftByPlayer[pick.playerName] = [];
        }
        draftByPlayer[pick.playerName].push(pick);
      });
      
      const playerPicks = draftByPlayer[playerName] || [];
      console.log(`Found ${playerPicks.length} picks for ${playerName}`);
      
      // Calculate stats based on player's actual picks
      let totalPoints = 0;
      let possiblePoints = 0;
      let completedEvents = 0;
      let upcomingEvents = 0;
      
      // Get player points from leaderboard data
      const playerData = leaderboardData.find((p: any) => p.playerName === playerName);
      if (playerData) {
        totalPoints = playerData.totalPoints;
      }
      
      // Calculate stats based on player's picks and event status
      playerPicks.forEach((pick: any, index: number) => {
        try {
          // Map team/athlete picks to leagues/events based on sport category and team name
          let maxPoints = 0;
          let eventCompleted = false;
          
          const teamOrAthlete = pick.teamOrAthlete || '';
          const category = pick.sportCategory || '';
          
          // Map picks to sports and assign points based on category
          if (category === 'Cool') {
            if (teamOrAthlete.includes('Dolphins') || teamOrAthlete.includes('NFL')) {
              maxPoints = 150; // NFL
              eventCompleted = false; // NFL season upcoming
            } else if (teamOrAthlete.includes('Uconn') || teamOrAthlete.includes('Texas')) {
              maxPoints = 100; // NCAAB 2026
              eventCompleted = false; // Upcoming season
            } else if (teamOrAthlete.includes('Niemann') || teamOrAthlete.includes('golf')) {
              maxPoints = 50; // Golf Majors
              eventCompleted = true; // Some majors completed
            }
          } else if (category === 'Neutral') {
            if (teamOrAthlete.includes('Lax') || teamOrAthlete.includes('LAX')) {
              maxPoints = 25; // College Lacrosse
              eventCompleted = true; // Completed in May
            } else if (teamOrAthlete.includes('Medvedev') || teamOrAthlete.includes('Sabalenka')) {
              maxPoints = 25; // Tennis
              eventCompleted = true; // Some tournaments completed
            } else if (teamOrAthlete.includes('Terps') || teamOrAthlete.includes('Kansas') || teamOrAthlete.includes('NCAAB')) {
              maxPoints = 100; // NCAAB
              eventCompleted = teamOrAthlete.includes('2026') ? false : true; // 2025 completed, 2026 upcoming
            } else if (teamOrAthlete.includes('NCAAF') || teamOrAthlete.includes('UNC')) {
              maxPoints = 100; // College Football
              eventCompleted = false; // Upcoming season
            }
          } else if (category === 'Wild Card') {
            if (teamOrAthlete.includes('Juventus')) {
              maxPoints = 50; // FIFA Club World Cup
              eventCompleted = true; // Completed in July
            } else if (teamOrAthlete.includes('Norris') || teamOrAthlete.includes('Leclerc')) {
              maxPoints = 50; // Formula 1
              eventCompleted = false; // Season ongoing
            }
          }
          
          possiblePoints += maxPoints;
          
          if (eventCompleted) {
            completedEvents++;
          } else {
            upcomingEvents++;
          }
          
        } catch (error) {
          console.error(`Error processing pick ${index}:`, error, pick);
        }
      });
      
      res.json({
        totalPoints,
        possiblePoints,
        completedEvents,
        upcomingEvents,
        totalPicks: playerPicks.length
      });
    } catch (error) {
      console.error("Error fetching player stats:", error);
      res.status(500).json({ message: "Failed to fetch player stats" });
    }
  });

  // Events routes - from database
  app.get('/api/events', async (req, res) => {
    try {
      const eventsData = await db.select().from(events).orderBy(events.name);
      res.json(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get('/api/events/upcoming', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const events = await storage.getUpcomingEvents(limit);
      res.json(events);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      res.status(500).json({ message: "Failed to fetch upcoming events" });
    }
  });

  // Leaderboard routes
  app.get('/api/leagues/:id/leaderboard', async (req, res) => {
    try {
      const leagueId = parseInt(req.params.id);
      const leaderboard = await storage.getLeaderboard(leagueId);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Participant routes
  app.get('/api/leagues/:id/participants', async (req, res) => {
    try {
      const leagueId = parseInt(req.params.id);
      const participants = await storage.getLeagueParticipants(leagueId);
      res.json(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });

  // Draft picks routes
  app.get('/api/leagues/:id/picks', async (req, res) => {
    try {
      const leagueId = parseInt(req.params.id);
      const picks = await storage.getPicksByLeague(leagueId);
      res.json(picks);
    } catch (error) {
      console.error("Error fetching picks:", error);
      res.status(500).json({ message: "Failed to fetch picks" });
    }
  });

  // CSV data routes for real performance tracking (support all players)
  app.get('/api/player/:name/data', async (req, res) => {
    try {
      const playerName = req.params.name;
      const leaderboardData = await csvProcessor.getLeaderboard();
      const playerInfo = leaderboardData.find((p: any) => p.playerName === playerName);
      
      if (!playerInfo) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.json({
        points: playerInfo.pointsBreakdown,
        totalPoints: playerInfo.totalPoints,
        completedEvents: playerInfo.completedEvents,
        rank: playerInfo.rank
      });
    } catch (error) {
      console.error("Error fetching player data:", error);
      res.status(500).json({ message: "Failed to fetch player data" });
    }
  });

  // Draft picks matrix - showing all players' picks by sport
  app.get('/api/draft/matrix', async (req, res) => {
    try {
      const participants = await db.select().from(leagueParticipants).orderBy(leagueParticipants.playerName);
      const allSports = await db.select().from(sports).orderBy(sports.name);
      const allPicks = await db.select().from(draftPicks);
      
      // Create matrix structure: sports as rows, players as columns
      const draftMatrix = {};
      
      for (const sport of allSports) {
        draftMatrix[sport.name] = {};
        for (const participant of participants) {
          const pick = allPicks.find(p => p.participantId === participant.id && p.sportId === sport.id);
          draftMatrix[sport.name][participant.playerName] = pick ? pick.teamOrPlayer : null;
        }
      }
      
      res.json({
        sports: allSports,
        players: participants.map(p => p.playerName),
        matrix: draftMatrix
      });
    } catch (error) {
      console.error("Error fetching draft matrix:", error);
      res.status(500).json({ message: "Failed to fetch draft matrix" });
    }
  });

  app.get('/api/leaderboard/real', async (req, res) => {
    try {
      // For now, use CSV data since it's the authoritative source
      // TODO: Migrate scoring data to match CSV exactly
      const leaderboard = await csvProcessor.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching real leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Complete draft data with player picks and completion status
  app.get('/api/draft/complete', async (req, res) => {
    try {
      const draftData = await csvProcessor.processDraftData();
      const scheduleData = await csvProcessor.processScheduleData();
      const leaderboardData = await csvProcessor.getLeaderboard();
      
      // Define completed sports based on master schedule - green highlighted items are completed
      const completedSports = new Set([
        'NCAAB (2025)', 'The Masters', 'NFL Draft', 'PGA Championship', 
        'College Lacrosse', 'French Open (Women\'s)', 'French Open (Men\'s)', 
        'US Open (Men\'s Golf)', 'NBA', 'NHL', 'FIFA Club World Cup', 
        'The Open Championship', 'Wimbledon (Women\'s)', 'Wimbledon (Men\'s)'
      ]);
      
      // Group picks by player for organized display
      const draftByPlayer: Record<string, any[]> = {};
      for (const pick of draftData) {
        if (!draftByPlayer[pick.playerName]) {
          draftByPlayer[pick.playerName] = [];
        }
        
        // Determine sport completion status based on sport category and team/athlete
        const category = pick.sportCategory.toLowerCase();
        const teamOrAthlete = pick.teamOrAthlete.toLowerCase();
        
        // Check completion based on sport category and specific picks
        let sportCompleted = false;
        
        if (category === 'cool') {
          // Cool sports - NFL Draft, Golf majors, NCAAB
          sportCompleted = teamOrAthlete.includes('draft') || // NFL Draft
                          teamOrAthlete.includes('golf') || 
                          teamOrAthlete.includes('scheffler') || // Golf picks
                          teamOrAthlete.includes('mcilroy') ||
                          teamOrAthlete.includes('morikawa') ||
                          teamOrAthlete.includes('schauffle') ||
                          teamOrAthlete.includes('ncaab 2025') || // Completed NCAAB season
                          teamOrAthlete.includes('duke basketball (2025)');
        } else if (category === 'neutral') {
          // Neutral sports - Tennis, Lacrosse, NBA, NHL (all completed by July 20)  
          sportCompleted = teamOrAthlete.includes('tennis') ||
                          teamOrAthlete.includes('mensik') ||
                          teamOrAthlete.includes('ostapenko') ||
                          teamOrAthlete.includes('lacrosse') ||
                          teamOrAthlete.includes('lax') ||
                          teamOrAthlete.includes('nba') ||
                          teamOrAthlete.includes('nhl') ||
                          teamOrAthlete.includes('thunder') ||
                          teamOrAthlete.includes('celtics') ||
                          teamOrAthlete.includes('hockey');
        } else if (category === 'wild card') {
          // Wild Card - Impressing Ryan and FIFA completed
          sportCompleted = teamOrAthlete.includes('impressing') ||
                          teamOrAthlete.includes('ryan') ||
                          teamOrAthlete.includes('fifa');
        }
        
        // Get league information for this pick
        const leagueMapping = LeagueMapper.getLeagueForPlayer(pick.teamOrAthlete);
        console.log(`Mapping ${pick.teamOrAthlete} ->`, leagueMapping);
        const leagueInfo = leagueMapping ? LeagueMapper.getLeagueInfo(leagueMapping.league) : null;
        
        draftByPlayer[pick.playerName].push({
          ...pick,
          isCompleted: sportCompleted,
          league: leagueMapping?.league || 'Unknown',
          sport: leagueMapping?.sport || pick.sportCategory,
          maxPoints: leagueMapping?.maxPoints || 0,
          leagueCompleted: leagueInfo?.isCompleted || false,
          leagueTotalPoints: leagueInfo?.totalPoints || 0
        });
      }
      
      // Create a mapping of player points from leaderboard data
      const playerPointsMap: Record<string, number> = {};
      leaderboardData.forEach(player => {
        playerPointsMap[player.playerName] = player.totalPoints;
      });
      
      // Debug logging for point mapping
      console.log('Player Points Mapping:', playerPointsMap);

      // Calculate user statistics for each player
      const userStats: Record<string, any> = {};
      Object.keys(draftByPlayer).forEach(playerName => {
        const playerPicks = draftByPlayer[playerName];
        const stats = LeagueMapper.calculateUserStats(playerPicks);
        userStats[playerName] = {
          ...stats,
          picks: playerPicks,
          currentPoints: playerPointsMap[playerName] || 0 // Add current points from CSV
        };
      });
      
      res.json({
        draftByPlayer,
        userStats,
        leagues: LeagueMapper.getAllLeagues(),
        scheduleData,
        completedSports: Array.from(completedSports),
        totalPlayers: Object.keys(draftByPlayer).length
      });
    } catch (error) {
      console.error("Error fetching complete draft:", error);
      res.status(500).json({ message: "Failed to fetch draft data" });
    }
  });

  // Schedule endpoint with completion status
  app.get('/api/schedule/complete', async (req, res) => {
    try {
      const scheduleData = await csvProcessor.processScheduleData();
      res.json(scheduleData);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      res.status(500).json({ message: "Failed to fetch schedule" });
    }
  });

  // Remove duplicate players endpoint since it's defined above

  const httpServer = createServer(app);
  return httpServer;
}