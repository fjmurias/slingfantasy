// League mapping service to map teams/players to their respective leagues
export interface League {
  name: string;
  sport: string;
  totalPoints: number;
  isCompleted: boolean;
  endDate: string;
}

export interface PlayerTeamMapping {
  teamOrPlayer: string;
  league: string;
  sport: string;
  maxPoints: number; // Points for 1st place
}

export class LeagueMapper {
  // Define all leagues with their point structures
  private static readonly LEAGUE_MAPPINGS: PlayerTeamMapping[] = [
    // NFL Teams
    { teamOrPlayer: 'Ravens', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Eagles', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Rams', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Miami Dolphins', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Colts', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Commanders', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Pittsburgh Steelers', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Chicago Bears', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Tampa Bay Buccaneers', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: '49ers', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Bengals', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Buffalo Bills', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Chiefs', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Lions', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Packers', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Minnesota Vikings', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Denver Broncos', league: 'NFL', sport: 'NFL', maxPoints: 150 },

    // NCAAB 2026 Teams (upcoming)
    { teamOrPlayer: 'Alabama NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Texas Tech NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Duke', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Houston NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Kentucky NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Texas', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'UConn', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'BYU', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Michigan State', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'St. John\'s NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Tennessee NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Florida NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Auburn NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Arizona NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'USC NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Kentucky', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Auburn', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Florida', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'UGA', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Tennessee', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Tennesee', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Terps Bball', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },

    // NCAAB 2025 Teams (completed) - Arkansas is here and should show as completed
    { teamOrPlayer: 'Arkansas', league: 'NCAAB (2025)', sport: 'NCAAB', maxPoints: 75 },
    { teamOrPlayer: 'Ole Miss', league: 'NCAAB (2025)', sport: 'NCAAB', maxPoints: 75 },
    { teamOrPlayer: 'Arizona NCAAB 2025', league: 'NCAAB (2025)', sport: 'NCAAB', maxPoints: 75 },

    // NCAAF Teams
    { teamOrPlayer: 'Alabama', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'Michigan NCAAF', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'South Carolina NCAAF', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'Indiana Football', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'Oklahoma NCAAF', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'Miami NCAAF', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'Texas A&M NCAAF', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'BYU NCAAF', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'SMU NCAAF', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },

    // Golf Players
    { teamOrPlayer: 'Colin Morikawa', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Scottie Scheffler', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Matt Fitzpatrick', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'McIlroy', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Tyrell Hatton', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Joaquim Niemann', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Ludvig AuBig', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Xander', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Jordan Spieth', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Akshay Bhatia', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Cameron Smith', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Tom Kim', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Bryson Dechambig', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Hideki Matsuyama', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Jon Rahm', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Justin Thomas', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Koepka', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Sungjae Im', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Sepp Straka', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Victor Hovland', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Will Zalatoris', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Wyndham Clark', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },

    // Tennis Players - Men's
    { teamOrPlayer: 'Jakub Mensik', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Zverev', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Alex de Minaur', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Medvedev', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Carlos Alcarez', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Ben Shelton', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Francis Tiafoe', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Jack Draper', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Taylor Fritz', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Tsitsipas', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Holger Rune', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Casper Ruud', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Cerundolo', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Djokovic', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },


    // Tennis Players - Women's  
    { teamOrPlayer: 'Jelena Ostapenko', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Elena Rybakina', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Sabalenka', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Swiatek', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Emma Navarro', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Emma Raducanu', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Jessica Pegula', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Karolina Muchova', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Barbora Krejcikova', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Elina Svitolina', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },

    // College Lacrosse (UMD is UMD Lacrosse based on Mazzie's picks)
    { teamOrPlayer: 'UMD', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 25 },
    { teamOrPlayer: 'UNC Lax', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 25 },
    { teamOrPlayer: 'Hopkins', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 25 },
    { teamOrPlayer: 'Georgetown', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 25 },
    { teamOrPlayer: 'Michigan Lax', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 25 },

    // NBA Teams
    { teamOrPlayer: 'Orlando Magic', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'Lakers', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'Boston Celtics', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'Knicks', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'GS Warriors', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'Cavaliers', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'Timberwolves', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'Denver Nuggets', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'Detroit Pistons', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'Los Angeles Clippers', league: 'NBA', sport: 'NBA', maxPoints: 75 },

    // MLB Teams
    { teamOrPlayer: 'Boston Red Sox', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'Chicago Cubs', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'Dodgers', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'Houston Astros', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'Kansas City Royals', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'Atlanta Braves', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'Detroit Tigers', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'Seattle Mariners', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'Minnesota Twins', league: 'MLB', sport: 'MLB', maxPoints: 50 },

    // FIFA Teams
    { teamOrPlayer: 'Al Hilal', league: 'FIFA Club World Cup', sport: 'FIFA', maxPoints: 50 },
    { teamOrPlayer: 'Bayern Munich', league: 'FIFA Club World Cup', sport: 'FIFA', maxPoints: 50 },
    { teamOrPlayer: 'Chelsea', league: 'FIFA Club World Cup', sport: 'FIFA', maxPoints: 50 },
    { teamOrPlayer: 'Juventus', league: 'FIFA Club World Cup', sport: 'FIFA', maxPoints: 50 },
    { teamOrPlayer: 'Atletico Madrid', league: 'FIFA Club World Cup', sport: 'FIFA', maxPoints: 50 },
    { teamOrPlayer: 'Dortmund', league: 'FIFA Club World Cup', sport: 'FIFA', maxPoints: 50 },
    { teamOrPlayer: 'Inter Miami', league: 'FIFA Club World Cup', sport: 'FIFA', maxPoints: 50 },
    { teamOrPlayer: 'FC Porto', league: 'FIFA Club World Cup', sport: 'FIFA', maxPoints: 50 },
    { teamOrPlayer: 'Flamengo', league: 'FIFA Club World Cup', sport: 'FIFA', maxPoints: 50 },
    { teamOrPlayer: 'SE Palmeiras SP', league: 'FIFA Club World Cup', sport: 'FIFA', maxPoints: 50 },

    // Additional F1 Drivers
    { teamOrPlayer: 'Yuki Tsunoda', league: 'Formula 1', sport: 'F1', maxPoints: 50 },
    { teamOrPlayer: 'Max Verstappen', league: 'Formula 1', sport: 'F1', maxPoints: 50 },

    // Additional Lacrosse Teams
    { teamOrPlayer: 'Army Lax', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 25 },
    { teamOrPlayer: 'Duke LAX', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 25 },
    { teamOrPlayer: 'Cuse Lax', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 25 },
    { teamOrPlayer: 'Harvard Lacrosse', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 25 },
    { teamOrPlayer: 'Cornell', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 25 },

    // Additional Personalities/Unknown categories
    { teamOrPlayer: 'Jannik Sinner', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Coco Gauffstetter', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Joao Fonseca', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },

    // Additional missing teams from draft board
    { teamOrPlayer: 'LSU', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Andrew Rubley', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Peterson', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },

    // NFL Teams (from screenshot)
    { teamOrPlayer: 'Buffalo Bills', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Bengals', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Chiefs', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Lions', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: '49ers', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Denver Broncos', league: 'NFL', sport: 'NFL', maxPoints: 150 },

    // NCAAB 2026 Teams (from screenshot)
    { teamOrPlayer: 'Michigan NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Auburn NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Florida NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Purdue NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Arizona NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'USC NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Tennessee', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Ohio State', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },

    // NCAAF Teams (from screenshot)
    { teamOrPlayer: 'SMU NCAAF', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'Texas A&M NCAAF', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'Notre Dame', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'UGA', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },

    // Golf Players (from screenshot)
    { teamOrPlayer: 'Hideki Matsuyama', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Koepka', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Patrick Cantlay', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Victor Hovland', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Jon Rahm', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Will Zalatoris', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },

    // NCAAB 2025 (Completed)
    { teamOrPlayer: 'Arizona NCAAB 2025', league: 'NCAAB (2025)', sport: 'NCAAB', maxPoints: 75 },
    { teamOrPlayer: 'Ole Miss NCAAB 2025', league: 'NCAAB (2025)', sport: 'NCAAB', maxPoints: 75 },
    { teamOrPlayer: 'Arkansas NCAAB 2025', league: 'NCAAB (2025)', sport: 'NCAAB', maxPoints: 75 },
    { teamOrPlayer: 'Ole Miss', league: 'NCAAB (2025)', sport: 'NCAAB', maxPoints: 75 },
    { teamOrPlayer: 'Arkansas', league: 'NCAAB (2025)', sport: 'NCAAB', maxPoints: 75 },

    // NBA Teams
    { teamOrPlayer: 'GS Warriors', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'OKC Thunder', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'Lakers', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'Cavaliers', league: 'NBA', sport: 'NBA', maxPoints: 75 },

    // NHL Teams  
    { teamOrPlayer: 'Florida Panthers', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'Oilers', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    
    // Formula 1 Drivers
    { teamOrPlayer: 'Yuki Tsunoda', league: 'Formula 1', sport: 'Formula 1', maxPoints: 50 },
    
    // MLB Teams
    { teamOrPlayer: 'Guardians', league: 'MLB', sport: 'MLB', maxPoints: 50 },

    // Impressing Ryan category
    { teamOrPlayer: 'Huff', league: 'Impressing Ryan', sport: 'Special Event', maxPoints: 10 },

    // Additional Formula 1 Drivers (from console log)
    { teamOrPlayer: 'Lewis Hamilton', league: 'Formula 1', sport: 'F1', maxPoints: 50 },
    { teamOrPlayer: 'Max Verstappen', league: 'Formula 1', sport: 'F1', maxPoints: 50 },
    { teamOrPlayer: 'Lando Norris', league: 'Formula 1', sport: 'F1', maxPoints: 50 },
    { teamOrPlayer: 'Oliver Bearman', league: 'Formula 1', sport: 'F1', maxPoints: 50 },
    { teamOrPlayer: 'Pierre Gasly', league: 'Formula 1', sport: 'F1', maxPoints: 50 },
    { teamOrPlayer: 'George Russell', league: 'Formula 1', sport: 'F1', maxPoints: 50 },
    { teamOrPlayer: 'Oscar Piastri', league: 'Formula 1', sport: 'F1', maxPoints: 50 },
    { teamOrPlayer: 'Alex Albon', league: 'Formula 1', sport: 'F1', maxPoints: 50 },
    { teamOrPlayer: 'Charles Leclerc', league: 'Formula 1', sport: 'F1', maxPoints: 50 },

    // Additional NHL Teams (from console log)
    { teamOrPlayer: 'Toronto Maple Leafs', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'Minnesota Wild', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'Colorado Avalanche', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'LA Kings', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'Capitals', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'Dallas Stars', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'Vancouver Canucks', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'Las Vegas Golden Knights', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'New Jersey Devils', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'Tampa Lightning', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'Carolina Hurricanes', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'Winnpeg Jets', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'Canadiens', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'Ottawa Senators', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'New York Rangers', league: 'NHL', sport: 'NHL', maxPoints: 75 },

    // Additional NFL Teams (from console log)
    { teamOrPlayer: 'Packers', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Houston Texans', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Minnesota Vikings', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Chargers', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Seattle Seahawks', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'New England Patriots', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'Jaguars', league: 'NFL', sport: 'NFL', maxPoints: 150 },

    // Additional NBA Teams (from console log)
    { teamOrPlayer: 'Milwaukee Bucks', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'Houston Rockets', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'St Louis Blues', league: 'NHL', sport: 'NHL', maxPoints: 75 },

    // Lacrosse Teams
    { teamOrPlayer: 'UNC Lax', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 35 },
    { teamOrPlayer: 'Michigan Lax', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 35 },
    { teamOrPlayer: 'Georgetown', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'LSU', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Hopkins', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 35 },
    { teamOrPlayer: 'Medvedev', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 25 },
    { teamOrPlayer: 'Andrew Rubley', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 25 },
    
    // Additional Tennis Players
    { teamOrPlayer: 'Sabalenka', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Alex de Minaur', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 25 },

    // Wild Card Picks
    { teamOrPlayer: 'Inter Milan', league: 'FIFA Club World Cup', sport: 'FIFA', maxPoints: 50 },
    { teamOrPlayer: 'Phillies', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'Carlos Sainz', league: 'Formula 1', sport: 'F1', maxPoints: 50 },
    { teamOrPlayer: 'Benfica Lisbon', league: 'FIFA Club World Cup', sport: 'FIFA', maxPoints: 50 },
    { teamOrPlayer: 'Botofogo', league: 'FIFA Club World Cup', sport: 'FIFA', maxPoints: 50 },
    { teamOrPlayer: 'San Francisco Giants', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'Padres', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'Antonelli Race Car Driver', league: 'Formula 1', sport: 'F1', maxPoints: 50 },

    // Additional MLB Teams (from console log)
    { teamOrPlayer: 'Minnesota Twins', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'Arizona Diamondbacks', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'Texas Rangers', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'Milwaukee Brewers', league: 'MLB', sport: 'MLB', maxPoints: 50 },
    { teamOrPlayer: 'LA Angels', league: 'MLB', sport: 'MLB', maxPoints: 50 },

    // Additional NCAAB 2026 Teams (from console log)
    { teamOrPlayer: 'Kansas NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Creighton NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'UNC NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'UCLA NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Iowa State NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Louisville NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'Gonzaga NCAAB 2026', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },

    // Additional NCAAF Teams (from console log)
    { teamOrPlayer: 'Clemson Football', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'Oregon NCAAF', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'Florida NCAAF', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'Southern Cal NCAAF', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },
    { teamOrPlayer: 'UNC NCAAF', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 },

    // Additional Golf Players (from console log)
    { teamOrPlayer: 'Tom Kim', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Cameron Smith', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Bryson Dechambig', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Justin Thomas', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Russell Henley', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Sam Burns', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Wyndham Clark', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Sahith Theegala', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Akshay Bhatia', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Sungjae Im', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Min Woo Lee', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Cameron Young', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Tommy Fleetwood', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Shane Lowry', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'Corey Conners', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },

    // Additional Tennis Players (from console log)
    { teamOrPlayer: 'Casper Ruud', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 25 },
    { teamOrPlayer: 'Mirra Andreeva', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'Karolina Muchova', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },

    // Additional Lacrosse Teams (from console log)
    { teamOrPlayer: 'Army Lax', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 35 },
    { teamOrPlayer: 'Harvard Lacrosse', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 35 },
    { teamOrPlayer: 'Richmond LAX', league: 'College Lacrosse', sport: 'Lacrosse', maxPoints: 35 },

    // Generic sport codes that were returning null (from console log)
    { teamOrPlayer: 'F1', league: 'Formula 1', sport: 'F1', maxPoints: 50 },
    { teamOrPlayer: 'MTENNIS', league: 'Men\'s Tennis', sport: 'Tennis', maxPoints: 25 },
    { teamOrPlayer: 'WTENNIS', league: 'Women\'s Tennis', sport: 'Tennis', maxPoints: 19 },
    { teamOrPlayer: 'NCAAB26', league: 'NCAAB (2026)', sport: 'NCAAB', maxPoints: 100 },
    { teamOrPlayer: 'NFL', league: 'NFL', sport: 'NFL', maxPoints: 150 },
    { teamOrPlayer: 'GOLF', league: 'Golf Majors', sport: 'Golf', maxPoints: 50 },
    { teamOrPlayer: 'NHL', league: 'NHL', sport: 'NHL', maxPoints: 75 },
    { teamOrPlayer: 'NBA', league: 'NBA', sport: 'NBA', maxPoints: 75 },
    { teamOrPlayer: 'NCAAF', league: 'NCAAF', sport: 'NCAAF', maxPoints: 100 }
  ];

  // Define league information
  private static readonly LEAGUES: League[] = [
    { name: 'NFL', sport: 'NFL', totalPoints: 150, isCompleted: false, endDate: 'February 2026' },
    { name: 'NCAAB (2026)', sport: 'NCAAB', totalPoints: 100, isCompleted: false, endDate: 'March 2026' },
    { name: 'NCAAB (2025)', sport: 'NCAAB', totalPoints: 75, isCompleted: true, endDate: 'Now' },
    { name: 'NCAAF', sport: 'NCAAF', totalPoints: 100, isCompleted: false, endDate: 'January 2026' },
    { name: 'Golf Majors', sport: 'Golf', totalPoints: 50, isCompleted: true, endDate: 'July 17-20' },
    { name: 'Men\'s Tennis', sport: 'Tennis', totalPoints: 19, isCompleted: true, endDate: 'July 2025' },
    { name: 'Women\'s Tennis', sport: 'Tennis', totalPoints: 19, isCompleted: true, endDate: 'July 2025' },
    { name: 'NBA', sport: 'NBA', totalPoints: 75, isCompleted: true, endDate: 'June 2025' },
    { name: 'NHL', sport: 'NHL', totalPoints: 75, isCompleted: true, endDate: 'June 2025' },
    { name: 'College Lacrosse', sport: 'Lacrosse', totalPoints: 35, isCompleted: true, endDate: 'May 24-26' },
    { name: 'FIFA Club World Cup', sport: 'FIFA', totalPoints: 50, isCompleted: true, endDate: 'July 2025' },
    { name: 'MLB', sport: 'MLB', totalPoints: 50, isCompleted: false, endDate: 'October 2025' },
    { name: 'Formula 1', sport: 'F1', totalPoints: 50, isCompleted: false, endDate: 'December 2025' }
  ];

  static getLeagueForPlayer(teamOrPlayer: string): PlayerTeamMapping | null {
    return this.LEAGUE_MAPPINGS.find(mapping => 
      mapping.teamOrPlayer.toLowerCase().includes(teamOrPlayer.toLowerCase()) ||
      teamOrPlayer.toLowerCase().includes(mapping.teamOrPlayer.toLowerCase())
    ) || null;
  }

  static getLeagueInfo(leagueName: string): League | null {
    return this.LEAGUES.find(league => league.name === leagueName) || null;
  }

  static getAllLeagues(): League[] {
    return this.LEAGUES;
  }

  static calculateUserStats(userPicks: any[]) {
    let currentPoints = 0;
    let maxPossiblePoints = 0;
    let completedPicks = 0;
    let totalPicks = userPicks.length;

    const leagueBreakdown: { [league: string]: {
      current: number;
      possible: number;
      completed: boolean;
      picks: string[];
    }} = {};

    userPicks.forEach(pick => {
      const mapping = this.getLeagueForPlayer(pick.teamOrAthlete);
      const league = mapping ? this.getLeagueInfo(mapping.league) : null;

      if (mapping && league) {
        if (!leagueBreakdown[mapping.league]) {
          leagueBreakdown[mapping.league] = {
            current: 0,
            possible: mapping.maxPoints,
            completed: league.isCompleted,
            picks: []
          };
        }

        leagueBreakdown[mapping.league].picks.push(pick.teamOrAthlete);

        if (pick.isCompleted) {
          completedPicks++;
          // Add actual points earned (would need to be calculated from results)
          // For now, using placeholder logic
        } else {
          // Add maximum possible points for incomplete leagues
          maxPossiblePoints += mapping.maxPoints;
        }
      }
    });

    return {
      currentPoints,
      maxPossiblePoints,
      completedPicks,
      totalPicks,
      completionPercentage: Math.round((completedPicks / totalPicks) * 100),
      leagueBreakdown
    };
  }
}