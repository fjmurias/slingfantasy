import fs from 'fs';
import path from 'path';

interface CSVRow {
  [key: string]: string;
}

export class CSVParser {
  static parseCSV(filePath: string): CSVRow[] {
    try {
      const csvContent = fs.readFileSync(filePath, 'utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length === 0) return [];
      
      const headers = lines[0].split(',').map(header => header.trim());
      const rows: CSVRow[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim());
        const row: CSVRow = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        
        rows.push(row);
      }
      
      return rows;
    } catch (error) {
      console.error(`Error parsing CSV file ${filePath}:`, error);
      return [];
    }
  }

  static parseDraftData(): {
    players: string[];
    picks: { [player: string]: { [sport: string]: string } };
    points: { [player: string]: number };
  } {
    const filePath = path.join(process.cwd(), 'attached_assets/RYANSSPORTSCHALLENGE 2026 - Draft_1753048934267.csv');
    const rows = this.parseCSV(filePath);
    
    const players: string[] = [];
    const picks: { [player: string]: { [sport: string]: string } } = {};
    const points: { [player: string]: number } = {};
    
    // Extract player names from row 2 (index 1)
    if (rows.length > 1) {
      const playerRow = rows[1];
      Object.values(playerRow).forEach((value, index) => {
        if (value && value !== '' && index > 0 && index < 17) { // Skip first column and after 16 players
          players.push(value);
          picks[value] = {};
        }
      });
    }
    
    // Extract picks from rows 4-21 (rounds 1-18)
    const sportMapping: { [round: number]: string } = {
      1: 'NFL', 2: 'NCAAB2026', 3: 'GOLF', 4: 'NBA', 5: 'MLB', 6: 'FIFA',
      7: 'NCAAF', 8: 'MTENNIS', 9: 'WTENNIS', 10: 'LAX', 11: 'NCAAB2025',
      12: 'NHL', 13: 'F1', 14: 'WILDCARD1', 15: 'WILDCARD2', 16: 'WILDCARD3',
      17: 'WILDCARD4', 18: 'WNBA'
    };
    
    for (let round = 1; round <= 18; round++) {
      const rowIndex = round + 2; // Offset for header rows
      if (rowIndex < rows.length) {
        const pickRow = rows[rowIndex];
        const sport = sportMapping[round] || `Round${round}`;
        
        players.forEach((player, playerIndex) => {
          const columnIndex = playerIndex + 1; // Skip first column
          const pick = Object.values(pickRow)[columnIndex];
          if (pick && pick !== '') {
            picks[player][sport] = pick;
          }
        });
      }
    }
    
    return { players, picks, points };
  }

  static parsePointsData(): { [player: string]: number } {
    const filePath = path.join(process.cwd(), 'attached_assets/RYANSSPORTSCHALLENGE 2026 - POINTS_1753048934267.csv');
    const rows = this.parseCSV(filePath);
    
    const points: { [player: string]: number } = {};
    
    rows.forEach(row => {
      const player = Object.values(row)[0];
      const totalPoints = Object.values(row)[Object.values(row).length - 1];
      
      if (player && totalPoints && !isNaN(parseFloat(totalPoints))) {
        points[player] = parseFloat(totalPoints);
      }
    });
    
    return points;
  }

  static parseScheduleData(): Array<{
    sport: string;
    endDate: string;
    type: string;
    maxPoints: number;
    pointStructure: number[];
  }> {
    const filePath = path.join(process.cwd(), 'attached_assets/RYANSSPORTSCHALLENGE 2026 - Schedule_1753048934266.csv');
    const rows = this.parseCSV(filePath);
    
    const schedule: Array<{
      sport: string;
      endDate: string;
      type: string;
      maxPoints: number;
      pointStructure: number[];
    }> = [];
    
    rows.forEach(row => {
      const values = Object.values(row);
      const sport = values[0];
      const endDate = values[1];
      const type = values[2];
      
      if (sport && endDate && type && sport !== 'Sport') {
        const pointStructure: number[] = [];
        let maxPoints = 0;
        
        // Extract point values from columns 3-10
        for (let i = 3; i <= 10; i++) {
          const points = parseFloat(values[i]);
          if (!isNaN(points)) {
            pointStructure.push(points);
            if (i === 3) maxPoints = points; // First place points
          }
        }
        
        schedule.push({
          sport,
          endDate,
          type,
          maxPoints,
          pointStructure,
        });
      }
    });
    
    return schedule;
  }
}
