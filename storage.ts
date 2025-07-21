import {
  users,
  leagues,
  leagueParticipants,
  sports,
  events,
  draftPicks,
  scoringResults,
  type User,
  type UpsertUser,
  type League,
  type InsertLeague,
  type LeagueParticipant,
  type InsertLeagueParticipant,
  type Sport,
  type InsertSport,
  type Event,
  type InsertEvent,
  type DraftPick,
  type InsertDraftPick,
  type ScoringResult,
  type InsertScoringResult,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // League operations
  createLeague(league: InsertLeague): Promise<League>;
  getLeague(id: number): Promise<League | undefined>;
  getLeaguesByUser(userId: string): Promise<League[]>;
  
  // Participant operations
  addParticipant(participant: InsertLeagueParticipant): Promise<LeagueParticipant>;
  getLeagueParticipants(leagueId: number): Promise<LeagueParticipant[]>;
  getParticipantByUserAndLeague(userId: string, leagueId: number): Promise<LeagueParticipant | undefined>;
  
  // Sport operations
  createSport(sport: InsertSport): Promise<Sport>;
  getAllSports(): Promise<Sport[]>;
  getSportByCode(code: string): Promise<Sport | undefined>;
  
  // Event operations
  createEvent(event: InsertEvent): Promise<Event>;
  getAllEvents(): Promise<Event[]>;
  getEventsBySport(sportId: number): Promise<Event[]>;
  getUpcomingEvents(limit?: number): Promise<Event[]>;
  
  // Draft operations
  createDraftPick(pick: InsertDraftPick): Promise<DraftPick>;
  getPicksByParticipant(participantId: number): Promise<DraftPick[]>;
  getPicksByLeague(leagueId: number): Promise<DraftPick[]>;
  
  // Scoring operations
  createScoringResult(result: InsertScoringResult): Promise<ScoringResult>;
  getLeaderboard(leagueId: number): Promise<any[]>;
  getParticipantScores(participantId: number): Promise<ScoringResult[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // League operations
  async createLeague(league: InsertLeague): Promise<League> {
    const [newLeague] = await db.insert(leagues).values(league).returning();
    return newLeague;
  }

  async getLeague(id: number): Promise<League | undefined> {
    const [league] = await db.select().from(leagues).where(eq(leagues.id, id));
    return league;
  }

  async getLeaguesByUser(userId: string): Promise<League[]> {
    return await db
      .select()
      .from(leagues)
      .where(eq(leagues.createdBy, userId))
      .orderBy(desc(leagues.createdAt));
  }

  // Participant operations
  async addParticipant(participant: InsertLeagueParticipant): Promise<LeagueParticipant> {
    const [newParticipant] = await db
      .insert(leagueParticipants)
      .values(participant)
      .returning();
    return newParticipant;
  }

  async getLeagueParticipants(leagueId: number): Promise<LeagueParticipant[]> {
    return await db
      .select()
      .from(leagueParticipants)
      .where(eq(leagueParticipants.leagueId, leagueId));
  }

  async getParticipantByUserAndLeague(userId: string, leagueId: number): Promise<LeagueParticipant | undefined> {
    const [participant] = await db
      .select()
      .from(leagueParticipants)
      .where(
        and(
          eq(leagueParticipants.userId, userId),
          eq(leagueParticipants.leagueId, leagueId)
        )
      );
    return participant;
  }

  // Sport operations
  async createSport(sport: InsertSport): Promise<Sport> {
    const [newSport] = await db.insert(sports).values(sport).returning();
    return newSport;
  }

  async getAllSports(): Promise<Sport[]> {
    return await db.select().from(sports).orderBy(sports.name);
  }

  async getSportByCode(code: string): Promise<Sport | undefined> {
    const [sport] = await db.select().from(sports).where(eq(sports.code, code));
    return sport;
  }

  // Event operations
  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async getAllEvents(): Promise<Event[]> {
    return await db
      .select({
        id: events.id,
        sportId: events.sportId,
        name: events.name,
        startDate: events.startDate,
        endDate: events.endDate,
        status: events.status,
        maxPoints: events.maxPoints,
        eventType: events.eventType,
        sportName: sports.name,
        sportCategory: sports.category,
        sportIcon: sports.icon,
      })
      .from(events)
      .leftJoin(sports, eq(events.sportId, sports.id))
      .orderBy(events.startDate);
  }

  async getEventsBySport(sportId: number): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(eq(events.sportId, sportId))
      .orderBy(events.startDate);
  }

  async getUpcomingEvents(limit = 10): Promise<Event[]> {
    return await db
      .select({
        id: events.id,
        sportId: events.sportId,
        name: events.name,
        startDate: events.startDate,
        endDate: events.endDate,
        status: events.status,
        maxPoints: events.maxPoints,
        eventType: events.eventType,
        sportName: sports.name,
        sportCategory: sports.category,
        sportIcon: sports.icon,
      })
      .from(events)
      .leftJoin(sports, eq(events.sportId, sports.id))
      .where(eq(events.status, 'upcoming'))
      .orderBy(events.startDate)
      .limit(limit);
  }

  // Draft operations
  async createDraftPick(pick: InsertDraftPick): Promise<DraftPick> {
    const [newPick] = await db.insert(draftPicks).values(pick).returning();
    return newPick;
  }

  async getPicksByParticipant(participantId: number): Promise<DraftPick[]> {
    return await db
      .select()
      .from(draftPicks)
      .where(eq(draftPicks.participantId, participantId))
      .orderBy(draftPicks.round, draftPicks.pickNumber);
  }

  async getPicksByLeague(leagueId: number): Promise<DraftPick[]> {
    return await db
      .select()
      .from(draftPicks)
      .where(eq(draftPicks.leagueId, leagueId))
      .orderBy(draftPicks.round, draftPicks.pickNumber);
  }

  // Scoring operations
  async createScoringResult(result: InsertScoringResult): Promise<ScoringResult> {
    const [newResult] = await db.insert(scoringResults).values(result).returning();
    return newResult;
  }

  async getLeaderboard(leagueId: number): Promise<any[]> {
    return await db
      .select({
        participantId: leagueParticipants.id,
        playerName: leagueParticipants.playerName,
        totalPoints: sql<number>`COALESCE(SUM(CAST(${scoringResults.points} AS DECIMAL)), 0)`.as('totalPoints'),
      })
      .from(leagueParticipants)
      .leftJoin(scoringResults, eq(leagueParticipants.id, scoringResults.participantId))
      .where(eq(leagueParticipants.leagueId, leagueId))
      .groupBy(leagueParticipants.id, leagueParticipants.playerName)
      .orderBy(desc(sql`totalPoints`));
  }

  async getParticipantScores(participantId: number): Promise<ScoringResult[]> {
    return await db
      .select()
      .from(scoringResults)
      .where(eq(scoringResults.participantId, participantId))
      .orderBy(desc(scoringResults.scoredAt));
  }
}

export const storage = new DatabaseStorage();