import { LiveMatch, Player, Club, MatchEvent } from '../types';
import { ACC } from './ACC'; 
import { PLAYSTYLES } from '../data/playstyles';
import { commentaryService } from '../services/commentaryService';

class LiveMatchEngine {
    private match: LiveMatch | null = null;
    private homePlayers: Player[] = [];
    private awayPlayers: Player[] = [];
    private homeTeam: Club | null = null;
    private awayTeam: Club | null = null;
    private time: number = 0;
    private homeScore: number = 0;
    private awayScore: number = 0;

    public initialize(match: LiveMatch, allPlayers: Player[], homeTeam: Club, awayTeam: Club) {
        this.match = match;
        // Simple best 11 selection for now
        this.homePlayers = allPlayers.filter(p => p.club_id === homeTeam.id).sort((a,b) => b.current_ability - a.current_ability).slice(0, 11);
        this.awayPlayers = allPlayers.filter(p => p.club_id === awayTeam.id).sort((a,b) => b.current_ability - a.current_ability).slice(0, 11);
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.time = 0;
        this.homeScore = 0;
        this.awayScore = 0;
    }

    private getModifiedAttribute(player: Player, attr: keyof Player['attributes']): number {
        const playstyle = PLAYSTYLES.find(p => p.id === player.playstyle_id);
        const baseValue = player.attributes[attr];
        const modifier = playstyle?.effects?.[attr] || 1.0;
        return baseValue * modifier;
    }

    private resolveContest(p1: Player, attr1: keyof Player['attributes'], p2: Player, attr2: keyof Player['attributes']): boolean {
        const p1Score = this.getModifiedAttribute(p1, attr1) + ACC.prng.seededRandom() * 5;
        const p2Score = this.getModifiedAttribute(p2, attr2) + ACC.prng.seededRandom() * 5;
        return p1Score > p2Score;
    }

    public async simulateNextChunk(): Promise<{ newTime: number; newEvents: MatchEvent[]; matchOver: boolean }> {
        if (!this.homeTeam || !this.awayTeam || !this.match) {
            return { newTime: 90, newEvents: [], matchOver: true };
        }

        const chunkDuration = Math.floor(ACC.prng.seededRandom() * 10) + 5;
        const endTime = Math.min(90, this.time + chunkDuration);
        const newEvents: MatchEvent[] = [];

        const homeMentality = this.homeTeam.tactics.mentality;

        // Simplified possession/dominance calculation
        const homeRating = this.homePlayers.reduce((s, p) => s + p.current_ability, 0) / 11;
        const awayRating = this.awayPlayers.reduce((s, p) => s + p.current_ability, 0) / 11;
        const dominance = (homeRating - awayRating) / 10; // Value between roughly -5 and 5

        for (let minute = this.time + 1; minute <= endTime; minute++) {
            const eventChance = 0.30; // Base chance of an interesting event
            if (ACC.prng.seededRandom() > eventChance) continue;

            const actionRoll = ACC.prng.seededRandom();

            if (actionRoll < 0.85) { // 85% chance of an attack
                const homeAttackBias = 0.5 + dominance / 10 + (homeMentality === 'Attacking' ? 0.1 : homeMentality === 'Defensive' ? -0.1 : 0);
            
                if (ACC.prng.seededRandom() < homeAttackBias) {
                    // Home team attack
                    const attacker = ACC.prng.getRandom(this.homePlayers.filter(p => p.position === 'FW' || p.position === 'MF'));
                    const defender = ACC.prng.getRandom(this.awayPlayers.filter(p => p.position === 'DF'));
                    const keeper = this.awayPlayers.find(p => p.position === 'GK');

                    if (this.resolveContest(attacker, 'dribbling', defender, 'tackling')) {
                        if (keeper && this.resolveContest(attacker, 'shooting', keeper, 'speed')) {
                            this.homeScore++;
                            const description = await commentaryService.generateCommentary({ type: 'Goal', minute, homeTeam: this.homeTeam, awayTeam: this.awayTeam, actingTeam: 'home', player: attacker, homeScore: this.homeScore, awayScore: this.awayScore });
                            newEvents.push({ minute, type: 'Goal', team: 'home', player: `${attacker.name.first} ${attacker.name.last}`, description });
                        } else {
                            const description = await commentaryService.generateCommentary({ type: 'Chance', minute, homeTeam: this.homeTeam, awayTeam: this.awayTeam, actingTeam: 'home', player: attacker, homeScore: this.homeScore, awayScore: this.awayScore });
                            newEvents.push({ minute, type: 'Chance', team: 'home', player: `${attacker.name.first} ${attacker.name.last}`, description });
                        }
                    }
                } else {
                    // Away team attack
                    const attacker = ACC.prng.getRandom(this.awayPlayers.filter(p => p.position === 'FW' || p.position === 'MF'));
                    const defender = ACC.prng.getRandom(this.homePlayers.filter(p => p.position === 'DF'));
                    const keeper = this.homePlayers.find(p => p.position === 'GK');
                    if (this.resolveContest(attacker, 'dribbling', defender, 'tackling')) {
                        if (keeper && this.resolveContest(attacker, 'shooting', keeper, 'speed')) {
                            this.awayScore++;
                            const description = await commentaryService.generateCommentary({ type: 'Goal', minute, homeTeam: this.homeTeam, awayTeam: this.awayTeam, actingTeam: 'away', player: attacker, homeScore: this.homeScore, awayScore: this.awayScore });
                            newEvents.push({ minute, type: 'Goal', team: 'away', player: `${attacker.name.first} ${attacker.name.last}`, description });
                        } else {
                            const description = await commentaryService.generateCommentary({ type: 'Chance', minute, homeTeam: this.homeTeam, awayTeam: this.awayTeam, actingTeam: 'away', player: attacker, homeScore: this.homeScore, awayScore: this.awayScore });
                            newEvents.push({ minute, type: 'Chance', team: 'away', player: `${attacker.name.first} ${attacker.name.last}`, description });
                        }
                    }
                }
            } else { // 15% chance of a card
                const actingTeam = ACC.prng.seededRandom() < 0.5 ? 'home' : 'away';
                const players = actingTeam === 'home' ? this.homePlayers : this.awayPlayers;
                const playerToCard = ACC.prng.getRandom(players.filter(p => p.position !== 'GK'));
                const description = await commentaryService.generateCommentary({ type: 'Card', minute, homeTeam: this.homeTeam, awayTeam: this.awayTeam, actingTeam, player: playerToCard, homeScore: this.homeScore, awayScore: this.awayScore });
                newEvents.push({ minute, type: 'Card', team: actingTeam, player: `${playerToCard.name.first} ${playerToCard.name.last}`, description });
            }
        }
        
        if (newEvents.length === 0 && endTime < 90) {
            const description = await commentaryService.generateCommentary({ type: 'General', minute: endTime, homeTeam: this.homeTeam, awayTeam: this.awayTeam, actingTeam: 'home', homeScore: this.homeScore, awayScore: this.awayScore });
            newEvents.push({
                minute: endTime,
                type: 'Commentary',
                team: 'none',
                description
            });
        }

        this.time = endTime;
        return { newTime: this.time, newEvents, matchOver: this.time >= 90 };
    }
}

export const liveMatchEngine = new LiveMatchEngine();