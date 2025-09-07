import { Player, Club, MatchEvent, Guild, GuildAction } from '../types';
import { ACC } from '../engine/ACC';

// This service acts as a public-facing API for the Aetherium Chronicle Core (ACC),
// ensuring that other parts of the application don't need to interact with the
// core engine directly. It can also be a place to add logging or caching.

export const proceduralService = {
    /**
     * Generates an array of nicknames for a player.
     * This is a fallback used when the Gemini API might fail.
     */
    generateNickname(player: Player): string[] {
        return ACC.generateNickname(player);
    },

    /**
     * Generates a text summary of a match based on its events.
     */
    generateMatchSummary(homeTeam: Club, awayTeam: Club, events: MatchEvent[]): string {
        return ACC.generateMatchSummary(homeTeam, awayTeam, events);
    },

    /**
     * Generates a dynamic guild-based scenario for the player to interact with.
     */
    generateGuildScenario(guild: Guild, club: Club): { subject: string; body: string; actions: GuildAction[] } | null {
        return ACC.generateGuildScenario(guild, club);
    }
};