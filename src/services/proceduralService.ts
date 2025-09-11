import { Player, Club, MatchEvent, Guild, GuildAction } from '../types';
import { ACC } from '../engine/ACC';

const generateNickname = async (player: Player): Promise<string[]> => {
    try {
        const response = await fetch('/api/generateNicknames', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ player }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch nicknames from API');
        }

        const data = await response.json();
        return data.nicknames;
    } catch (error) {
        console.error("Gemini API nickname generation failed, using fallback:", error);
        // Fallback to local procedural generation on error
        return ACC.generateNickname(player);
    }
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
