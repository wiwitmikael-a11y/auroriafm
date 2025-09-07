import { Player, Club, MatchEvent, Guild, GuildAction } from '../types';
import { ACC } from '../engine/ACC';

const generateNickname = (player: Player): string[] => {
    return ACC.generateNickname(player);
};


export const proceduralService = {
    /**
     * Generates an array of nicknames for a player.
     */
    generateNickname,

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
