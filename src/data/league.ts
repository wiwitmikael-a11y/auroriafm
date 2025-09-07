import { LeagueTableRow, Fixture } from '../types';

export const INITIAL_LEAGUE_TABLE: LeagueTableRow[] = [];

// Function to generate a round-robin schedule
export const generateFixtures = (clubIds: string[]): Fixture[] => {
    const fixtures: Fixture[] = [];
    const teams = [...clubIds];
    const numTeams = teams.length;
    let day = 1;

    if (numTeams % 2 !== 0) {
        teams.push("bye"); // Add a dummy team for odd numbers
    }

    const rounds = (numTeams - 1) * 2; // Home and away
    
    for (let round = 0; round < rounds; round++) {
        for (let match = 0; match < numTeams / 2; match++) {
            const home = teams[match];
            const away = teams[numTeams - 1 - match];

            if (home !== "bye" && away !== "bye") {
                 // Alternate home and away
                if (round % 2 === 0) {
                    fixtures.push({ day, home_team_id: home, away_team_id: away });
                } else {
                    fixtures.push({ day, home_team_id: away, away_team_id: home });
                }
            }
        }
        day += 7; // One match per week

        // Rotate teams
        const lastTeam = teams.pop()!;
        teams.splice(1, 0, lastTeam);
    }

    return fixtures;
};