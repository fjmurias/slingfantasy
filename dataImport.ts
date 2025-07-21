import { storage } from "../storage";
import fs from 'fs';
import path from 'path';

interface CSVRow {
  [key: string]: string;
}

class DataImportService {
  private parseCSV(csvContent: string): CSVRow[] {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = this.parseCSVLine(line);
      const row: CSVRow = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return row;
    });
  }

  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  async importFromCSV(): Promise<void> {
    try {
      console.log('Starting CSV data import...');

      // First create a system user if it doesn't exist
      let systemUser = await storage.getUser("system");
      if (!systemUser) {
        systemUser = await storage.upsertUser({
          id: "system",
          email: "system@ryansports.com",
          firstName: "System",
          lastName: "Admin",
          profileImageUrl: null
        });
      }

      // Create the main league  
      const league = await storage.createLeague({
        name: "Ryan's Sports Challenge 2026",
        description: "Multi-sport fantasy league spanning 18+ sports", 
        season: "2026",
        createdBy: "system"
      });

      console.log('Created league:', league.name);

      // Import sports and events from schedule CSV
      await this.importScheduleData(league.id);
      
      // Import draft data
      await this.importDraftData(league.id);
      
      // Import points data
      await this.importPointsData(league.id);

      console.log('CSV data import completed successfully');
    } catch (error) {
      console.error('Error during CSV import:', error);
      throw error;
    }
  }

  private async importScheduleData(leagueId: number): Promise<void> {
    const csvPath = path.join(process.cwd(), 'attached_assets', 'RYANSSPORTSCHALLENGE 2026 - Schedule_1753048934266.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.log('Schedule CSV file not found, skipping...');
      return;
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const rows = this.parseCSV(csvContent);

    // Sport mappings with categories
    const sportCategories = new Map([
      ['NFL', 'Cool'],
      ['NCAAB (2026)', 'Cool'], 
      ['NCAAF', 'Cool'],
      ['Golf', 'Cool'],
      ['PGA Championship', 'Cool'],
      ['The Masters', 'Cool'],
      ['US Open (Men\'s Golf)', 'Cool'],
      ['The Open Championship', 'Cool'],
      ['FedEx Cup', 'Cool'],
      ['Ryder Cup', 'Cool'],
      ['College Lacrosse', 'Neutral'],
      ['French Open (Women\'s)', 'Neutral'],
      ['French Open (Men\'s)', 'Neutral'],
      ['NBA', 'Neutral'],
      ['NHL', 'Neutral'],
      ['Wimbledon (Women\'s)', 'Neutral'],
      ['Wimbledon (Men\'s)', 'Neutral'],
      ['US Open (Women\'s Tennis)', 'Neutral'],
      ['US Open (Men\'s Tennis)', 'Neutral'],
      ['Australian Open (Women\'s)', 'Neutral'],
      ['Australian Open (Men\'s)', 'Neutral'],
      ['FIFA Club World Cup', 'Wild Card'],
      ['WNBA', 'Wild Card'],
      ['MLB', 'Wild Card'],
      ['Formula 1', 'Wild Card'],
      ['Impressing Ryan', 'Wild Card'],
      ['NCAAB (2025)', 'Cool'] // Special case - already completed
    ]);

    const sportIcons = new Map([
      ['NFL', '🏈'],
      ['NCAAB (2026)', '🏀'], 
      ['NCAAF', '🏈'],
      ['Golf', '⛳'],
      ['PGA Championship', '⛳'],
      ['The Masters', '⛳'],
      ['US Open (Men\'s Golf)', '⛳'],
      ['The Open Championship', '⛳'],
      ['FedEx Cup', '⛳'],
      ['Ryder Cup', '⛳'],
      ['College Lacrosse', '🥍'],
      ['French Open (Women\'s)', '🎾'],
      ['French Open (Men\'s)', '🎾'],
      ['NBA', '🏀'],
      ['NHL', '🏒'],
      ['Wimbledon (Women\'s)', '🎾'],
      ['Wimbledon (Men\'s)', '🎾'],
      ['US Open (Women\'s Tennis)', '🎾'],
      ['US Open (Men\'s Tennis)', '🎾'],
      ['Australian Open (Women\'s)', '🎾'],
      ['Australian Open (Men\'s)', '🎾'],
      ['FIFA Club World Cup', '⚽'],
      ['WNBA', '🏀'],
      ['MLB', '⚾'],
      ['Formula 1', '🏎️'],
      ['Impressing Ryan', '⭐'],
      ['NCAAB (2025)', '🏀']
    ]);

    // Create sports and events
    for (const row of rows) {
      if (!row.Sport || row.Sport.trim() === '') continue;

      const sportName = row.Sport.trim();
      const category = sportCategories.get(sportName) || 'Neutral';
      const icon = sportIcons.get(sportName) || '🏆';

      // Create sport
      let sport = await storage.getSportByCode(sportName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase());
      if (!sport) {
        sport = await storage.createSport({
          name: sportName,
          code: sportName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase(),
          category,
          icon
        });
      }

      // Create event
      const endDate = row['Ending Date'] && row['Ending Date'] !== 'Now' ? 
        new Date(row['Ending Date']) : new Date();
      
      const maxPoints = row['1st'] ? parseFloat(row['1st']) : 0;
      const status = row['Ending Date'] === 'Now' ? 'completed' : 'upcoming';

      await storage.createEvent({
        sportId: sport.id,
        name: `${sportName} Championship`,
        startDate: new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000)), // 7 days before end
        endDate,
        status,
        maxPoints: maxPoints.toString(),
        eventType: row.Type || 'championship'
      });
    }

    console.log('Imported schedule data');
  }

  private async importDraftData(leagueId: number): Promise<void> {
    const csvPath = path.join(process.cwd(), 'attached_assets', 'RYANSSPORTSCHALLENGE 2026 - Draft_1753048934267.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.log('Draft CSV file not found, skipping...');
      return;
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');
    
    // Get player names from row 2
    const playerNames = lines[1].split(',').slice(1, 17); // Skip first empty cell, take 16 players
    
    // Create participants
    const participants = [];
    for (let i = 0; i < playerNames.length; i++) {
      const name = playerNames[i].trim();
      if (name && name !== '') {
        const participant = await storage.addParticipant({
          leagueId,
          userId: `player_${i + 1}`, // Temporary user IDs
          playerName: name
        });
        participants.push(participant);
      }
    }

    // Process draft picks (rounds 1-18)
    for (let roundIndex = 4; roundIndex < 21 && roundIndex < lines.length; roundIndex++) {
      const picks = lines[roundIndex].split(',').slice(1, 17); // Skip round number, take 16 picks
      const round = roundIndex - 3; // Round 1 starts at line index 4
      
      for (let pickIndex = 0; pickIndex < picks.length && pickIndex < participants.length; pickIndex++) {
        const pick = picks[pickIndex].trim();
        if (pick && pick !== '') {
          await storage.createDraftPick({
            leagueId,
            participantId: participants[pickIndex].id,
            sportId: 1, // Will be updated based on sport mapping
            round,
            pickNumber: (round - 1) * 16 + pickIndex + 1,
            teamOrPlayer: pick,
            isWildCard: false
          });
        }
      }
    }

    console.log('Imported draft data for', participants.length, 'participants');
  }

  private async importPointsData(leagueId: number): Promise<void> {
    const csvPath = path.join(process.cwd(), 'attached_assets', 'RYANSSPORTSCHALLENGE 2026 - POINTS_1753048934267.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.log('Points CSV file not found, skipping...');
      return;
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const rows = this.parseCSV(csvContent);

    // Get all participants
    const participants = await storage.getLeagueParticipants(leagueId);
    const events = await storage.getAllEvents();

    // Process scoring data
    for (const row of rows) {
      const playerName = row.Players;
      const participant = participants.find(p => p.playerName === playerName);
      
      if (participant) {
        // For each event column, create scoring results
        Object.keys(row).forEach(async (eventKey) => {
          if (eventKey !== 'Players' && row[eventKey] && row[eventKey].trim() !== '') {
            const points = parseFloat(row[eventKey]);
            if (!isNaN(points) && points > 0) {
              const event = events.find(e => e.name.includes(eventKey) || eventKey.includes(e.sport?.name || ''));
              if (event) {
                await storage.createScoringResult({
                  eventId: event.id,
                  participantId: participant.id,
                  pickId: 1, // Temporary - would need to match with actual picks
                  placement: 1, // Would calculate based on points
                  points: points.toString()
                });
              }
            }
          }
        });
      }
    }

    console.log('Imported points data');
  }
}

export const dataImport = new DataImportService();