import { Player, Club, MatchResult, MatchEvent, TacticSettings } from '../types';
import { ACC } from './ACC';

const getTeamXI = (teamId: string, allPlayers: Player[]): Player[] => {
    return allPlayers
        .filter(p => p.club_id === teamId)
        .sort((a, b) => b.current_ability - a.current_ability)
        .slice(0, 11);
};

const getTeamRating = (xi: Player[], tactics: TacticSettings): number => {
    if (xi.length === 0) return 50;
    const baseAbility = xi.reduce((sum, p) => sum + p.current_ability, 0) / xi.length;
    
    let mentalityMod = 0;
    if (tactics.mentality.includes('Attacking')) mentalityMod = 5;
    if (tactics.mentality.includes('Defensive')) mentalityMod = -5;

    return baseAbility + mentalityMod;
}

export const matchSimulator = {
    run: (homeTeam: Club, awayTeam: Club, allPlayers: Player[]): MatchResult => {
        const homeXI = getTeamXI(homeTeam.id, allPlayers);
        const awayXI = getTeamXI(awayTeam.id, allPlayers);

        const homeRating = getTeamRating(homeXI, homeTeam.tactics);
        const awayRating = getTeamRating(awayXI, awayTeam.tactics);

        const ratingDifference = homeRating - awayRating;
        const events: MatchEvent[] = [];
        let homeScore = 0;
        let awayScore = 0;

        // More goals for higher quality matches, plus home advantage and rating difference
        const expectedGoals = 1.5 + (homeRating + awayRating) / 200;
        const homeGoalChance = (expectedGoals / 90) * (1 + (ratingDifference / 100));
        const awayGoalChance = (expectedGoals / 90) * (1 - (ratingDifference / 100));

        for (let minute = 1; minute <= 90; minute++) {
            if (ACC.prng.seededRandom() < homeGoalChance) {
                homeScore++;
                const scorer = ACC.prng.getRandom(homeXI.filter(p => p.position !== 'GK'));
                events.push({ minute, type: 'Goal', team: 'home', player: `${scorer.name.first} ${scorer.name.last}`, description: 'Goal!' });
            }
            if (ACC.prng.seededRandom() < awayGoalChance) {
                awayScore++;
                const scorer = ACC.prng.getRandom(awayXI.filter(p => p.position !== 'GK'));
                events.push({ minute, type: 'Goal', team: 'away', player: `${scorer.name.first} ${scorer.name.last}`, description: 'Goal!' });
            }
        }
        
        events.sort((a, b) => a.minute - b.minute);

        return {
            day: 0, // Day will be set by the context
            home_team_id: homeTeam.id,
            away_team_id: awayTeam.id,
            home_score: homeScore,
            away_score: awayScore,
            events,
        };
    }
};