import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// League management
export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  season: varchar("season", { length: 10 }).notNull(),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// League participants
export const leagueParticipants = pgTable("league_participants", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull().references(() => leagues.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  playerName: varchar("player_name", { length: 100 }).notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Sports definition
export const sports = pgTable("sports", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  category: varchar("category", { length: 20 }).notNull(), // Cool, Neutral, Fruity
  icon: varchar("icon", { length: 50 }),
});

// Events/competitions
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  sportId: integer("sport_id").notNull().references(() => sports.id),
  name: varchar("name", { length: 255 }).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  status: varchar("status", { length: 20 }).default('upcoming'), // upcoming, active, completed
  maxPoints: decimal("max_points", { precision: 8, scale: 2 }),
  eventType: varchar("event_type", { length: 50 }), // championship, regular_season, etc
});

// Draft picks
export const draftPicks = pgTable("draft_picks", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull().references(() => leagues.id),
  participantId: integer("participant_id").notNull().references(() => leagueParticipants.id),
  sportId: integer("sport_id").notNull().references(() => sports.id),
  round: integer("round").notNull(),
  pickNumber: integer("pick_number").notNull(),
  teamOrPlayer: varchar("team_or_player", { length: 255 }).notNull(),
  isWildCard: boolean("is_wild_card").default(false),
  pickedAt: timestamp("picked_at").defaultNow(),
});

// Scoring results
export const scoringResults = pgTable("scoring_results", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  participantId: integer("participant_id").notNull().references(() => leagueParticipants.id),
  pickId: integer("pick_id").notNull().references(() => draftPicks.id),
  placement: integer("placement"), // 1st, 2nd, 3rd, etc
  points: decimal("points", { precision: 8, scale: 2 }).notNull(),
  scoredAt: timestamp("scored_at").defaultNow(),
});

// Relations
export const leaguesRelations = relations(leagues, ({ one, many }) => ({
  creator: one(users, {
    fields: [leagues.createdBy],
    references: [users.id],
  }),
  participants: many(leagueParticipants),
}));

export const leagueParticipantsRelations = relations(leagueParticipants, ({ one, many }) => ({
  league: one(leagues, {
    fields: [leagueParticipants.leagueId],
    references: [leagues.id],
  }),
  user: one(users, {
    fields: [leagueParticipants.userId],
    references: [users.id],
  }),
  picks: many(draftPicks),
  scores: many(scoringResults),
}));

export const sportsRelations = relations(sports, ({ many }) => ({
  events: many(events),
  picks: many(draftPicks),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  sport: one(sports, {
    fields: [events.sportId],
    references: [sports.id],
  }),
  scores: many(scoringResults),
}));

export const draftPicksRelations = relations(draftPicks, ({ one, many }) => ({
  league: one(leagues, {
    fields: [draftPicks.leagueId],
    references: [leagues.id],
  }),
  participant: one(leagueParticipants, {
    fields: [draftPicks.participantId],
    references: [leagueParticipants.id],
  }),
  sport: one(sports, {
    fields: [draftPicks.sportId],
    references: [sports.id],
  }),
  scores: many(scoringResults),
}));

export const scoringResultsRelations = relations(scoringResults, ({ one }) => ({
  event: one(events, {
    fields: [scoringResults.eventId],
    references: [events.id],
  }),
  participant: one(leagueParticipants, {
    fields: [scoringResults.participantId],
    references: [leagueParticipants.id],
  }),
  pick: one(draftPicks, {
    fields: [scoringResults.pickId],
    references: [draftPicks.id],
  }),
}));

// Insert schemas
export const insertLeagueSchema = createInsertSchema(leagues).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeagueParticipantSchema = createInsertSchema(leagueParticipants).omit({
  id: true,
  joinedAt: true,
});

export const insertSportSchema = createInsertSchema(sports).omit({
  id: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const insertDraftPickSchema = createInsertSchema(draftPicks).omit({
  id: true,
  pickedAt: true,
});

export const insertScoringResultSchema = createInsertSchema(scoringResults).omit({
  id: true,
  scoredAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type League = typeof leagues.$inferSelect;
export type InsertLeague = z.infer<typeof insertLeagueSchema>;
export type LeagueParticipant = typeof leagueParticipants.$inferSelect;
export type InsertLeagueParticipant = z.infer<typeof insertLeagueParticipantSchema>;
export type Sport = typeof sports.$inferSelect;
export type InsertSport = z.infer<typeof insertSportSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type DraftPick = typeof draftPicks.$inferSelect;
export type InsertDraftPick = z.infer<typeof insertDraftPickSchema>;
export type ScoringResult = typeof scoringResults.$inferSelect;
export type InsertScoringResult = z.infer<typeof insertScoringResultSchema>;
