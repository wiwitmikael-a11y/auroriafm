// src/engine/liveMatchEngine.ts
// FIX: The file content was corrupted. This is a new, functional implementation.
import { LiveMatch, Player, Club, MatchEvent } from '../types';
import { commentaryService } from '../services/commentaryService';
import { ACC } from './ACC';

class LiveMatchEngine {
    private homeTeam: Club | null = null;
    private awayTeam: Club | null = null;
    private homeXI: Player[] = [];
    private awayXI: Player[] = [];
    private currentTime: number = 0;
    private matchOver: boolean = false;
    private homeScore: number = 0;
    private awayScore: number = 0;

    public initialize(liveMatch: LiveMatch, allPlayers: Player[], homeTeam: Club, awayTeam: Club) {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;

        // A better implementation would use the tactics from the club, but for now we'll take best XI.
        this.homeXI = allPlayers
            .filter(p => p.club_id === this.homeTeam?.id)
            .sort((a, b) => b.current_ability - a.current_ability)
            .slice(0, 11);
        
        this.awayXI = allPlayers
            .filter(p => p.club_id === this.awayTeam?.id)
            .sort((a, b) => b.current_ability - a.current_ability)
            .slice(0, 11);

        this.currentTime = 0;
        this.matchOver = false;
        this.homeScore = 0;
        this.awayScore = 0;

        // Initialize PRNG for this match
        ACC.initialize(liveMatch.day + homeTeam.id.charCodeAt(0) + awayTeam.id.charCodeAt(0));
    }

    private getTeamRating(xi: Player[]): number {
        if (xi.length === 0) return 100;
        return xi.reduce((sum, p) => sum + p.current_ability, 0) / xi.length;
    }

    public simulateNextChunk(): { newTime: number; newEvents: MatchEvent[]; matchOver: boolean } {
        if (this.matchOver || !this.homeTeam || !this.awayTeam) {
            return { newTime: this.currentTime, newEvents: [], matchOver: this.matchOver };
        }

        const newEvents: MatchEvent[] = [];
        const chunkDuration = 5 + Math.floor(ACC.prng.seededRandom() * 10); // Simulate between 5 and 15 minutes
        const endOfChunk = Math.min(90, this.currentTime + chunkDuration);

        const homeRating = this.getTeamRating(this.homeXI);
        const awayRating = this.getTeamRating(this.awayXI);
        const ratingDifference = homeRating - awayRating;

        const baseChancePerMinute = 0.05; // 5% chance of a highlight per minute
        
        for (let minute = this.currentTime + 1; minute <= endOfChunk; minute++) {
            if (ACC.prng.seededRandom() < baseChancePerMinute) {
                // A highlight occurred!
                const isHomeTeamAction = ACC.prng.seededRandom() * 200 < (100 + ratingDifference);
                const actingTeam = isHomeTeamAction ? 'home' : 'away';
                const actingXI = isHomeTeamAction ? this.homeXI : this.awayXI;
                
                const eventTypeRoll = ACC.prng.seededRandom();
                let eventType: MatchEvent['type'] = 'Chance';
                if (eventTypeRoll < 0.3) { // 30% chance of a goal from a highlight
                    eventType = 'Goal';
                }

                // Pick a player (more likely attackers)
                const attackers = actingXI.filter(p => p.position === 'FW' || p.position === 'MF');
                const player = ACC.prng.getRandom(attackers.length > 0 ? attackers : actingXI);

                const commentary = commentaryService.generateCommentary({
                    type: eventType,
                    minute,
                    homeTeam: this.homeTeam,
                    awayTeam: this.awayTeam,
                    homeScore: this.homeScore,
                    awayScore: this.awayScore,
                    actingTeam,
                    player
                });

                newEvents.push({
                    minute,
                    type: eventType,
                    team: actingTeam,
                    player: player ? `${player.name.first} ${player.name.last}` : undefined,
                    description: commentary,
                });

                if (eventType === 'Goal') {
                    if (actingTeam === 'home') this.homeScore++;
                    else this.awayScore++;
                }
            }
        }

        this.currentTime = endOfChunk;
        
        if (this.currentTime >= 90) {
            this.matchOver = true;
        }

        return { newTime: this.currentTime, newEvents, matchOver: this.matchOver };
    }
}

export const liveMatchEngine = new LiveMatchEngine();
