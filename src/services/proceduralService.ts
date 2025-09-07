import { Player, Club, MatchEvent, Guild, GuildAction, Nation } from '../types';
import { ACC } from '../engine/ACC';
import { NATIONS } from '../data/nations';
import { PLAYSTYLES } from '../data/playstyles';

// This service acts as a public-facing API for the Aetherium Chronicle Core (ACC),
// ensuring that other parts of the application don't need to interact with the
// core engine directly. It can also be a place to add logging or caching.

const generateNickname = (player: Player): string[] => {
    const randomNation: Nation = ACC.prng.getRandom(NATIONS);
    // FIX: The player object has `playstyle_id`, not `playstyle`. Look up the playstyle name from PLAYSTYLES.
    const playstyle = PLAYSTYLES.find(p => p.id === player.playstyle_id);
    const templates = [
        `The ${playstyle?.name || 'Versatile'}`,
        `${player.name.last} the Great`,
        `The ${randomNation.adjective} Comet`,
        `"The Cog" ${player.name.last}`,
        `${player.name.first} "The Viper"`,
    ];
    // Use a PRNG seeded with player ID for deterministic-random results
    // FIX: The localRandom function was returning a single number, not a generator function. It now returns a function that can be called repeatedly to get new random numbers.
    const localRandom = (seed: number) => {
        return function() {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }
    const seed = player.id.charCodeAt(player.id.length - 1);
    const prng = localRandom(seed);
    const shuffled = templates.sort(() => 0.5 - prng());
    return shuffled.slice(0, 3);
};


export const proceduralService = {
    /**
     * Generates an array of nicknames for a player.
     * This is a fallback used when the Gemini API might fail.
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