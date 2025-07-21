import * as fs from 'fs';
import * as path from 'path';
import { storage } from '../storage';

interface PlayerPoints {
  [playerName: string]: {
    [sportEvent: string]: number;
  };
}

interface PlayerPick {
  playerName: string;
  sportCategory: string;
  teamOrAthlete: string;
  isWildCard: boolean;
  round?: number;
  sportEvent?: string;
  isCompleted?: boolean;
}

interface ScheduleEvent {
  sport: string;
  endingDate: string;
  type: string;
  pointStructure: number[];
  isCompleted?: boolean;
}

export class CSVProcessor {
  
  // Process the points CSV to get real user data
  async processPointsData(): Promise<PlayerPoints & { totals: { [player: string]: number } }> {
    const csvPath = path.join(process.cwd(), 'attached_assets', 'RYANSSPORTSCHALLENGE 2026 - POINTS_1753050683103.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.log('Points CSV file not found');
      return { totals: {} };
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) return { totals: {} };
    
    // Parse CSV manually to handle the specific format
    const headers = lines[0].split(',').map(h => h.trim());
    const playerPoints: PlayerPoints = {};
    const totals: { [player: string]: number } = {};
    
    // Find the index of the empty column (which contains totals)
    const totalColumnIndex = headers.findIndex(h => h === '');
    
    // Process each player row
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const playerName = values[0];
      
      if (!playerName || playerName === '') continue;
      
      playerPoints[playerName] = {};
      
      // Get the total from the last column (empty header column)
      if (totalColumnIndex >= 0 && values[totalColumnIndex] && !isNaN(Number(values[totalColumnIndex]))) {
        totals[playerName] = parseFloat(values[totalColumnIndex]);
      }
      
      // Map each sport event to points (for breakdown display)
      for (let j = 1; j < headers.length && j < values.length; j++) {
        const sportEvent = headers[j];
        const pointsStr = values[j];
        
        // Skip empty column headers and empty/invalid values
        if (!sportEvent || sportEvent.trim() === '' || !pointsStr || pointsStr === '' || isNaN(Number(pointsStr))) {
          continue;
        }
        
        const points = parseFloat(pointsStr);
        // Include all non-zero values, including negative ones
        if (points !== 0) {
          playerPoints[playerName][sportEvent] = points;
        }
      }
    }
    
    return { ...playerPoints, totals };
  }
  
  // Process draft data to show what each player picked
  async processDraftData(): Promise<PlayerPick[]> {
    const csvPath = path.join(process.cwd(), 'attached_assets', 'RYANSSPORTSCHALLENGE 2026 - Draft_1753050683104.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.log('Draft CSV file not found');
      return [];
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    const picks: PlayerPick[] = [];
    
    // Find the main draft section (starts around line 3, player names in line 2)
    let playerHeaderLine = -1;
    let sportMappingStart = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Pat,Mazzie,Huff,Collins,Steed,Kane,Frank,Robbie')) {
        playerHeaderLine = i;
        break;
      }
    }
    
    if (playerHeaderLine === -1) return picks;
    
    const playerNames = lines[playerHeaderLine].split(',').slice(1, -3); // Remove first empty and last 3 metadata columns
    
    // Find sport mapping section
    for (let i = playerHeaderLine + 20; i < lines.length; i++) {
      if (lines[i].includes('Sports,Pat,Mazzie,Huff')) {
        sportMappingStart = i;
        break;
      }
    }
    
    if (sportMappingStart === -1) return picks;
    
    // Process sport mappings
    for (let i = sportMappingStart + 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line || line.trim() === '' || line.includes('WC Count')) break;
      
      const parts = line.split(',');
      if (parts.length < 2) continue;
      
      const sport = parts[0].trim();
      if (!sport || sport === '' || sport.includes('%')) continue;
      
      // Map each player's pick for this sport
      for (let j = 1; j < parts.length && j <= playerNames.length; j++) {
        const pick = parts[j]?.trim();
        const playerName = playerNames[j - 1]?.trim();
        
        if (pick && playerName && pick !== '' && pick !== playerName) {
          picks.push({
            playerName: playerName,
            sportCategory: this.getSportCategory(sport),
            teamOrAthlete: pick,
            isWildCard: false
          });
        }
      }
    }
    
    return picks;
  }
  
  private getSportCategory(sport: string): string {
    const coolSports = ['NFL', 'NCAAF', 'NCAAB2026', 'GOLF', 'Masters', 'PGA', 'US Open'];
    const neutralSports = ['NBA', 'NHL', 'LAX', 'MTENNIS', 'WTENNIS', 'NCAAB2025', 'NCAAB (2025)', 'Tennis', 'Lacrosse'];
    const wildCardSports = ['FIFA', 'MLB', 'F1', 'Impressing Ryan'];
    
    if (coolSports.some(s => sport.includes(s))) return 'Cool';
    if (neutralSports.some(s => sport.includes(s))) return 'Neutral';  
    if (wildCardSports.some(s => sport.includes(s))) return 'Wild Card';
    
    return 'Neutral';
  }
  
  // Get Fern's specific data for the dashboard
  async getFernData() {
    const data = await this.processPointsData();
    const draftData = await this.processDraftData();
    
    const fernPoints = data['Fern'] || {};
    const fernPicks = draftData.filter(pick => pick.playerName === 'Fern');
    
    // Use the total directly from CSV (more accurate than calculating)
    const totalPoints = data.totals['Fern'] || 0;
    
    // Count completed events (events with non-zero points)
    const completedEvents = Object.entries(fernPoints).filter(([event, points]) => 
      event && event.trim() !== '' && points !== 0
    ).length;
    const totalPicks = fernPicks.length;
    
    console.log('Fern Points Data:', fernPoints);
    console.log('Fern Total Points (from CSV):', totalPoints);
    console.log('Fern Completed Events:', completedEvents);
    
    return {
      points: fernPoints,
      picks: fernPicks,
      totalPoints,
      completedEvents,
      totalPicks,
      playerRank: await this.getFernRank(data)
    };
  }
  
  private async getFernRank(allPointsData: PlayerPoints): Promise<number> {
    const playerTotals = Object.entries(allPointsData).map(([name, points]) => ({
      name,
      total: Object.values(points).reduce((sum, p) => sum + p, 0)
    }));
    
    playerTotals.sort((a, b) => b.total - a.total);
    
    const fernIndex = playerTotals.findIndex(p => p.name === 'Fern');
    return fernIndex >= 0 ? fernIndex + 1 : playerTotals.length;
  }
  
  // Get full leaderboard
  async getLeaderboard() {
    const data = await this.processPointsData();
    
    const leaderboard = Object.keys(data).filter(key => key !== 'totals').map(name => {
      const points = data[name] || {};
      const pointsEntries = Object.entries(points).filter(([event, p]) => 
        event && event.trim() !== '' && p !== 0
      );
      const completedEvents = pointsEntries.length;
      
      // Use total directly from CSV
      const totalPoints = data.totals[name] || 0;
      
      return {
        playerName: name,
        totalPoints,
        completedEvents,
        pointsBreakdown: points
      };
    });
    
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
    
    return leaderboard.map((player, index) => ({
      ...player,
      rank: index + 1
    }));
  }

  // Process schedule data for event timeline
  async processScheduleData(): Promise<ScheduleEvent[]> {
    const csvPath = path.join(process.cwd(), 'attached_assets', 'RYANSSPORTSCHALLENGE 2026 - Schedule_1753050683104.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.log('Schedule CSV file not found');
      return [];
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) return [];
    
    const events: ScheduleEvent[] = [];
    
    // Define completed sports based on master schedule (green highlighted = completed)
    // Current date is July 20, 2025, so anything before this date is completed
    const completedSports = new Set([
      'NCAAB (2025)', // Now - completed
      'The Masters', // April 10-13 - completed  
      'NFL Draft', // April 24 - completed
      'PGA Championship', // May 15-18 - completed
      'College Lacrosse', // May 24-26 - completed
      'French Open (Women\'s)', // June 2025 - completed
      'French Open (Men\'s)', // June 2025 - completed
      'US Open (Men\'s Golf)', // June 12-15 - completed
      'NBA', // June 2025 - completed (before July 20)
      'NHL', // June 2025 - completed (before July 20)
      'FIFA Club World Cup', // July 2025 - completed (before July 20)
      'The Open Championship', // July 17-20 - completed
      'Wimbledon (Women\'s)', // July 2025 - completed
      'Wimbledon (Men\'s)', // July 2025 - completed
      'FedEx', // August 21-24 - but if green in screenshot, it's completed
      'US Open (Women\'s Tennis)', // September 2025 - upcoming
      'US Open (Men\'s Tennis)' // September 2025 - upcoming
    ]);
    
    // Process each event row (skip header)
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      // Skip invalid rows
      if (values.length < 3 || !values[0] || values[0] === '') continue;
      
      // Skip rows that are totals, empty, or invalid data
      if (values[0].includes('Sports Ranked') || 
          values[0].includes('Total') || 
          values[0] === 'Sport' ||
          !isNaN(Number(values[0]))) continue;
      
      const sportName = values[0].trim();
      const endingDate = values[1]?.trim() || '';
      const sportType = values[2]?.trim() || '';
      
      // Skip if we already have this sport (avoid duplicates)
      const existingEvent = events.find(e => e.sport === sportName);
      if (existingEvent) continue;
      
      // Only process rows with proper sport names and valid point structures
      const pointStructure = values.slice(3, 11)
        .map(v => v?.trim())
        .filter(v => v && !isNaN(Number(v)) && v !== '')
        .map(Number);
      
      // Skip if no valid point structure
      if (pointStructure.length === 0) continue;
      
      // Check if this sport is completed based on our master list or date logic
      const isCompleted = completedSports.has(sportName) || 
                         endingDate === 'Now' ||
                         this.isDateBeforeJuly2025(endingDate) ||
                         (sportName === 'NBA' && endingDate === 'June 2025') ||
                         (sportName === 'NHL' && endingDate === 'June 2025') ||
                         (sportName === 'FIFA Club World Cup' && endingDate === 'July 2025') ||
                         (sportName === 'Wimbledon (Men\'s)' && endingDate === 'July 2025') ||
                         (sportName === 'Wimbledon (Women\'s)' && endingDate === 'July 2025') ||
                         (sportName === 'The Open Championship' && endingDate === 'July 17-20');
      
      const event: ScheduleEvent = {
        sport: sportName,
        endingDate: endingDate,
        type: sportType,
        pointStructure: pointStructure,
        isCompleted
      };
      
      events.push(event);
    }
    
    return events.sort((a, b) => {
      // Sort by completion status first, then by date
      if (a.isCompleted && !b.isCompleted) return -1;
      if (!a.isCompleted && b.isCompleted) return 1;
      return a.sport.localeCompare(b.sport);
    });
  }

  // Helper method to check if date is before July 20, 2025
  private isDateBeforeJuly2025(dateString: string): boolean {
    if (!dateString || dateString === 'TBD') return false;
    
    const currentDate = new Date('2025-07-20');
    
    // Handle various date formats
    if (dateString === 'Now') return true;
    
    if (dateString.includes('2025')) {
      const monthStr = dateString.toLowerCase();
      if (monthStr.includes('june') || monthStr.includes('may') || monthStr.includes('april') || monthStr.includes('march')) {
        return true;
      }
      if (monthStr.includes('july')) {
        // Need to check specific July dates
        if (dateString.includes('17-20') || dateString.includes('July 17-20')) {
          return true; // The Open Championship ends July 20
        }
        return false; // Other July events might be upcoming
      }
    }
    
    // Handle specific date ranges
    if (dateString.includes('May') || dateString.includes('April') || dateString.includes('June')) {
      return true;
    }
    
    return false;
  }
}

export const csvProcessor = new CSVProcessor();