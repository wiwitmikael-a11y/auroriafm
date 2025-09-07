// Simplified src/worker/simulation.bundle.worker.ts

self.onmessage = (e) => {
    const { type, payload } = e.data;

    if (type === 'ADVANCE_DAY') {
        const { players, clubs, gameDate, scoutingAssignments, fixtures, leagueTable } = payload;
        
        const newGameDate = { ...gameDate, day: gameDate.day + 1 };
        const newMessages = [];
        
        // Update scouting
        const updatedScoutingAssignments = scoutingAssignments
            .map(a => ({ ...a, daysRemaining: a.daysRemaining - 1 }))
            .filter(a => a.daysRemaining > 0);
            
        const finishedScouting = scoutingAssignments.filter(a => a.daysRemaining <= 1);
        const updatedPlayers = [...players];

        finishedScouting.forEach(assignment => {
            const playerIndex = updatedPlayers.findIndex(p => p.id === assignment.playerId);
            if (playerIndex > -1) {
                updatedPlayers[playerIndex] = { ...updatedPlayers[playerIndex], scouting_knowledge: 100 };
                const player = updatedPlayers[playerIndex];
                newMessages.push({
                    id: `msg_scout_${player.id}`,
                    type: 'Scouting',
                    sender: 'Chief Scout',
                    subject: `Scouting Report: ${player.name.first} ${player.name.last}`,
                    date: `Season ${newGameDate.season}, Day ${newGameDate.day}`,
                    body: `The report on ${player.name.last} is complete. All attributes are now revealed.`,
                    isRead: false,
                });
            }
        });
        
        // Here you would simulate matches and update the league table.
        // For this simplified version, we pass it back unmodified.

        self.postMessage({
            type: 'ADVANCE_DAY_RESULT',
            payload: {
                gameDate: newGameDate,
                players: updatedPlayers,
                leagueTable: leagueTable, // Pass back unmodified
                newMessages,
                scoutingAssignments: updatedScoutingAssignments
            }
        });
    }
};

self.postMessage({ type: 'READY' });
