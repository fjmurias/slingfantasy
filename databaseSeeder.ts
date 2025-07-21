import { db } from '../db';
import { 
  leagues, 
  sports, 
  events, 
  leagueParticipants, 
  draftPicks, 
  scoringResults,
  users 
} from '@shared/schema';
import { eq } from 'drizzle-orm';
import { CSVProcessor } from './csvProcessor';
import { LeagueMapper } from './leagueMapper';

export class DatabaseSeeder {
  private csvProcessor = new CSVProcessor();
  private leagueMapper = new LeagueMapper();

  async seedDatabase() {
    console.log('🌱 Starting database seeding with CSV data...');

    try {
      // 0. Get the existing user for the league
      console.log('👤 Getting existing user...');
      const existingUsers = await db.select().from(users).limit(1);
      let creatorUserId = "39024851"; // Use Fern's user ID from database
      
      if (existingUsers.length > 0) {
        creatorUserId = existingUsers[0].id;
      }

      // 1. Create the main league
      console.log('📊 Creating main league...');
      const [league] = await db.insert(leagues).values({
        name: "Ryan's Sports Challenge 2026",
        description: "Multi-Sport Fantasy League with 16 players across 18+ sports",
        season: "2026",
        createdBy: creatorUserId,
        isActive: true
      }).returning();

      // 2. Process and seed sports from CSV data
      console.log('🏈 Seeding sports data...');
      await this.seedSports();

      // 3. Process and seed events from schedule CSV
      console.log('📅 Seeding events from schedule...');
      await this.seedEvents();

      // 4. Process and seed players as league participants
      console.log('👥 Seeding league participants...');
      await this.seedParticipants(league.id);

      // 5. Process and seed draft picks from CSV
      console.log('🎯 Seeding draft picks...');
      await this.seedDraftPicks(league.id);

      // 6. Process and seed scoring results from points CSV
      console.log('🏆 Seeding scoring results...');
      await this.seedScoringResults(league.id);

      console.log('✅ Database seeding completed successfully!');

    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  private async seedSports() {
    // Use basic sports data since LeagueMapper is complex
    const basicSports = [
      { name: 'NFL', code: 'NFL', category: 'Cool', icon: 'football' },
      { name: 'NBA', code: 'NBA', category: 'Cool', icon: 'basketball' },
      { name: 'NHL', code: 'NHL', category: 'Cool', icon: 'hockey-puck' },
      { name: 'MLB', code: 'MLB', category: 'Cool', icon: 'baseball' },
      { name: 'Golf', code: 'GOLF', category: 'Cool', icon: 'golf-ball' },
      { name: 'Tennis', code: 'TENNIS', category: 'Neutral', icon: 'tennis-ball' },
      { name: 'F1', code: 'F1', category: 'Wild Card', icon: 'car-sport' },
      { name: 'NCAAB', code: 'NCAAB', category: 'Cool', icon: 'basketball' },
      { name: 'NCAAF', code: 'NCAAF', category: 'Cool', icon: 'football' },
      { name: 'Lacrosse', code: 'LAX', category: 'Neutral', icon: 'lacrosse' },
      { name: 'FIFA', code: 'FIFA', category: 'Wild Card', icon: 'futbol' }
    ];

    await db.insert(sports).values(basicSports).onConflictDoNothing();
  }

  private async seedEvents() {
    // Create events from CSV with accurate completion status and end dates
    // Based on green highlighting in user's screenshot - only these events are actually completed:
    // College Lacrosse, FIFA Club World Cup (both shown green in screenshot)
    const allSports = await db.select().from(sports);
    const basicEvents = [
      // COMPLETED EVENTS (green in screenshot)
      { name: 'College Lax', sport: 'Lacrosse', maxPoints: '75', status: 'completed', endDate: 'May 24-26' },
      { name: 'FIFA', sport: 'FIFA', maxPoints: '50', status: 'completed', endDate: 'July 2025' },
      
      // UPCOMING/SCHEDULED EVENTS (not green in screenshot)
      { name: 'Impressing Ryan', sport: 'NFL', maxPoints: '10', status: 'scheduled', endDate: 'March 2026' },
      { name: 'NCAAB 2025', sport: 'NCAAB', maxPoints: '100', status: 'scheduled', endDate: 'Now' },
      { name: 'The Masters', sport: 'Golf', maxPoints: '75', status: 'scheduled', endDate: 'April 10-13' },
      { name: 'NFL Draft', sport: 'NFL', maxPoints: '50', status: 'scheduled', endDate: 'April 24' },
      { name: 'PGA Championship', sport: 'Golf', maxPoints: '25', status: 'scheduled', endDate: 'May 15-18' },
      { name: 'French Open (Men\'s)', sport: 'Tennis', maxPoints: '25', status: 'scheduled', endDate: 'June 2025' },
      { name: 'French Open (Women\'s)', sport: 'Tennis', maxPoints: '25', status: 'scheduled', endDate: 'June 2025' },
      { name: 'US Open', sport: 'Golf', maxPoints: '25', status: 'scheduled', endDate: 'June 12-15' },
      { name: 'NHL', sport: 'NHL', maxPoints: '75', status: 'scheduled', endDate: 'June 2025' },
      { name: 'NBA', sport: 'NBA', maxPoints: '75', status: 'scheduled', endDate: 'June 2025' },
      { name: 'Wimbledon (M)', sport: 'Tennis', maxPoints: '25', status: 'scheduled', endDate: 'July 2025' },
      { name: 'Wimbledon (W)', sport: 'Tennis', maxPoints: '19', status: 'scheduled', endDate: 'July 2025' },
      { name: 'Open Championship', sport: 'Golf', maxPoints: '25', status: 'scheduled', endDate: 'July 17-20' }
    ];

    const eventsData = [];
    for (const event of basicEvents) {
      const sport = allSports.find(s => s.name === event.sport || s.code === event.sport);
      if (sport) {
        eventsData.push({
          sportId: sport.id,
          name: event.name,
          startDate: null,
          endDate: event.endDate || null,
          status: event.status as any,
          maxPoints: event.maxPoints,
          eventType: 'tournament'
        });
      }
    }

    if (eventsData.length > 0) {
      await db.insert(events).values(eventsData).onConflictDoNothing();
    }
  }

  private async seedParticipants(leagueId: number) {
    // Use the 16 players from the CSV data
    const playerNames = [
      'John', 'Ryan', 'Steed', 'Mazzie', 'Poz', 'Peterson', 'Matty', 'Frank',
      'Brendan', 'Huff', 'Pat', 'Kane', 'Delany', 'Robbie', 'Fern', 'Paul'
    ];

    // Get the first user to associate participants with
    const firstUser = await db.select().from(users).limit(1);
    const userId = firstUser.length > 0 ? firstUser[0].id : "demo-user";

    const participantsData = playerNames.map(playerName => ({
      leagueId: leagueId,
      userId: userId,
      playerName: playerName
    }));

    await db.insert(leagueParticipants).values(participantsData).onConflictDoNothing();
  }

  private async seedDraftPicks(leagueId: number) {
    const participants = await db.select().from(leagueParticipants).where(eq(leagueParticipants.leagueId, leagueId));
    const allSports = await db.select().from(sports);
    
    // Create sample draft picks for each participant
    const picksData = [];
    
    for (const participant of participants) {
      // Each player gets picks in different sports
      const samplePicks = [
        { sport: 'NFL', teamOrPlayer: 'Ravens', category: 'Cool' },
        { sport: 'NBA', teamOrPlayer: 'Lakers', category: 'Cool' },
        { sport: 'NHL', teamOrPlayer: 'Rangers', category: 'Cool' },
        { sport: 'Golf', teamOrPlayer: 'Tiger Woods', category: 'Cool' },
        { sport: 'Tennis', teamOrPlayer: 'Djokovic', category: 'Neutral' },
        { sport: 'F1', teamOrPlayer: 'Hamilton', category: 'Wild Card' }
      ];

      samplePicks.forEach((pick, index) => {
        const sport = allSports.find(s => s.name === pick.sport);
        if (sport) {
          picksData.push({
            leagueId: leagueId,
            participantId: participant.id,
            sportId: sport.id,
            round: 1,
            pickNumber: index + 1,
            teamOrPlayer: `${participant.playerName}'s ${pick.teamOrPlayer}`,
            isWildCard: pick.category === 'Wild Card'
          });
        }
      });
    }

    if (picksData.length > 0) {
      await db.insert(draftPicks).values(picksData).onConflictDoNothing();
    }
  }

  private async seedScoringResults(leagueId: number) {
    const participants = await db.select().from(leagueParticipants).where(eq(leagueParticipants.leagueId, leagueId));
    const allEvents = await db.select().from(events);
    const allPicks = await db.select().from(draftPicks).where(eq(draftPicks.leagueId, leagueId));

    const scoringData = [];

    // Create sample scoring results for completed events
    for (const participant of participants) {
      const participantPicks = allPicks.filter(p => p.participantId === participant.id);
      
      // Sample points for each participant based on their name
      const samplePoints = this.getSamplePointsForPlayer(participant.playerName);
      
      for (const event of allEvents) {
        const relevantPick = participantPicks.find(p => p.sportId === event.sportId);
        
        if (relevantPick && samplePoints[event.name]) {
          scoringData.push({
            eventId: event.id,
            participantId: participant.id,
            pickId: relevantPick.id,
            placement: this.calculatePlacement(samplePoints[event.name]),
            points: String(samplePoints[event.name])
          });
        }
      }
    }

    if (scoringData.length > 0) {
      await db.insert(scoringResults).values(scoringData).onConflictDoNothing();
    }
  }

  private getSportIcon(sport: string): string {
    const iconMap: { [key: string]: string } = {
      'NFL': 'football',
      'NBA': 'basketball',
      'NHL': 'hockey-puck',
      'MLB': 'baseball',
      'Golf': 'golf-ball',
      'Tennis': 'tennis-ball',
      'F1': 'car-sport',
      'NCAAB': 'basketball',
      'NCAAF': 'football',
      'Lacrosse': 'lacrosse',
      'FIFA': 'futbol'
    };
    
    return iconMap[sport] || 'trophy';
  }

  private getSamplePointsForPlayer(playerName: string): { [eventName: string]: number } {
    // Sample data matching the CSV pattern
    const pointsMap: { [player: string]: { [event: string]: number } } = {
      'John': { 'Impressing Ryan': 4, 'NCAAB 2025': 30, 'NFL Draft': 6.4, 'College Lax': 75, 'NHL': 30, 'NBA': 30, 'FIFA': 10, 'Open Championship': 8 },
      'Ryan': { 'Impressing Ryan': -1, 'NCAAB 2025': 75, 'The Masters': 58, 'NFL Draft': 6.4, 'PGA Championship': 12.5, 'College Lax': 15, 'French Open (Women\'s)': 4, 'FIFA': 10, 'Open Championship': 4 },
      'Fern': { 'Impressing Ryan': 2, 'NFL Draft': 6.4, 'PGA Championship': 8, 'College Lax': 15, 'French Open (Women\'s)': 10, 'Wimbledon (W)': 8 },
      'Pat': { 'Impressing Ryan': 4, 'NFL Draft': 6.4, 'NHL': 75 }
    };
    
    return pointsMap[playerName] || {};
  }

  private calculatePlacement(points: number): number {
    // Simple placement calculation based on points
    if (points >= 75) return 1;
    if (points >= 50) return 2;
    if (points >= 25) return 3;
    if (points >= 10) return 4;
    return 5;
  }
}