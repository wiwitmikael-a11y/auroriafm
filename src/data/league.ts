import { Fixture, Club } from "../types";
import { CLUBS } from "./clubs";

export const generateLeagueFixtures = (clubs: Club[]): Fixture[] => {
    const fixtures: Fixture[] = [];
    let localClubs = [...clubs];
    if (localClubs.length % 2 !== 0) {
        // Add a dummy team for an even number of teams
        localClubs.push({ id: 'dummy', name: 'Dummy', short_name: 'DUM' } as Club);
    }

    const numTeams = localClubs.length;
    const numRounds = (numTeams - 1);
    const matchesPerRound = numTeams / 2;
    let dayCounter = 7; // Start first match on day 7

    const teamIds = localClubs.map(c => c.id);

    // First half of the season
    for (let round = 0; round < numRounds; round++) {
        for (let match = 0; match < matchesPerRound; match++) {
            const home = teamIds[match];
            const away = teamIds[numTeams - 1 - match];
            if(home !== 'dummy' && away !== 'dummy') {
                fixtures.push({ day: dayCounter, home_team_id: home, away_team_id: away });
            }
        }
        // Rotate teams
        const lastTeam = teamIds.pop()!;
        teamIds.splice(1, 0, lastTeam);
        dayCounter += 7; // One match per week
    }

    // Second half of the season (reversed fixtures)
    const firstHalfFixtures = [...fixtures];
    firstHalfFixtures.forEach(fixture => {
        fixtures.push({
            day: dayCounter,
            home_team_id: fixture.away_team_id,
            away_team_id: fixture.home_team_id,
        });
        if (fixtures.length % matchesPerRound === 0) {
            dayCounter += 7;
        }
    });


    return fixtures.sort((a,b) => a.day - b.day);
};

// Initial generation for context
export const LEAGUE_FIXTURES = generateLeagueFixtures([...CLUBS]);
