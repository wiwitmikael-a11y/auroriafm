// A simple match simulation engine

import { TacticalPlayer, Club, MatchResult, MatchEvent } from '../types';
import { ACC } from './ACC';

const getTeamStrength = (teamId: string, allPlayers: TacticalPlayer[], clubs: Club[]): number => {
    const club = clubs.find(c => c.id === teamId);
    const teamPlayers = allPlayers.filter(p => p.club_id === teamId);
    if (!club || teamPlayers.length === 0) return 50; // Default strength

    const averageAbility = teamPlayers.reduce((sum, p) => sum + p.current_ability, 0) / teamPlayers.length;
    
    // Add tactical modifiers later
    let strength = averageAbility;

    return strength;
}

const run = (homeTeamId: string, awayTeamId: string, allPlayers: TacticalPlayer[], clubs: Club[]): MatchResult => {
    const homeStrength = getTeamStrength(homeTeamId, allPlayers, clubs);
    const awayStrength = getTeamStrength(awayTeamId, allPlayers, clubs);

    const strengthDifference = homeStrength - awayStrength;

    // Simple goal generation based on strength
    let homeScore = 0;
    let awayScore = 0;
    const events: MatchEvent[] = [];

    const homeGoalChance = 0.08 + (strengthDifference / 100);
    const awayGoalChance = 0.06 - (strengthDifference / 100);

    for (let minute = 1; minute <= 90; minute++) {
        if (ACC.prng.getRandom([true, false, false, false])) { // Chance of an event happening
             if (ACC.prng.seededRandom() < homeGoalChance) {
                homeScore++;
                const scorer = ACC.prng.getRandom(allPlayers.filter(p => p.club_id === homeTeamId && p.position !== 'GK'));
                events.push({ minute, type: 'Goal', team: 'home', player: `${scorer.name.first} ${scorer.name.last}`, description: 'Goal!' });
            }
            if (ACC.prng.seededRandom() < awayGoalChance) {
                awayScore++;
                const scorer = ACC.prng.getRandom(allPlayers.filter(p => p.club_id === awayTeamId && p.position !== 'GK'));
                events.push({ minute, type: 'Goal', team: 'away', player: `${scorer.name.first} ${scorer.name.last}`, description: 'Goal!' });
            }
        }
    }
    
    events.sort((a,b) => a.minute - b.minute);

    return {
        day: 0, // Day will be set by the context
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        home_score: homeScore,
        away_score: awayScore,
        events,
    };
};

export const matchSimulator = {
    run,
};
