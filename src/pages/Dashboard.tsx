import React from 'react';
import { useWorld } from '../contexts/WorldContext';
import { Link } from 'react-router-dom';
import ManagerCat from '../components/ManagerCat';

const Dashboard: React.FC = () => {
    const { managerClubId, findClubById, leagueTable, gameDate } = useWorld();
    const club = findClubById(managerClubId);
    // FIX: The `clubTableRow` variable was not defined. It is now derived
    // by searching the `leagueTable` for the manager's current club.
    const clubTableRow = leagueTable.find(row => row.club_id === managerClubId);

    if (!club) {
        return <div>Loading...</div>;
    }
    
    const welcomeMessage = gameDate.day === 1 && gameDate.season === 1
        ? `Welcome, Manager. Your career at ${club.name} begins now.`
        : "Welcome back, Manager. Here's the state of the club.";

    return (
        <div className="animate-fade-in relative h-full">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Dashboard</h1>
                <p className="text-md text-text-secondary">{welcomeMessage}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Next Match */}
                <div className="glass-surface p-4 flex flex-col">
                    <h2 className="text-lg font-display font-bold text-accent mb-3 uppercase">Next Match</h2>
                    <div className="flex-grow">
                        <p className="text-md text-text-primary">Vs. Gearhaven United</p>
                        <p className="text-sm text-text-secondary">(Home)</p>
                        <p className="text-xs text-text-secondary mt-1">Season 1, Day 14</p>
                    </div>
                    <Link to="/match" className="mt-4 inline-block button-primary text-center">
                        Go to Match
                    </Link>
                </div>

                {/* League Position */}
                <div className="glass-surface p-4 flex flex-col">
                    <h2 className="text-lg font-display font-bold text-accent mb-3 uppercase">League Standing</h2>
                    {clubTableRow ? (
                        <div className="flex-grow">
                            <p className="text-6xl font-display font-black text-text-emphasis">{clubTableRow.pos}</p>
                            <p className="text-sm text-text-secondary">{clubTableRow.pts} points from {clubTableRow.p} games</p>
                        </div>
                    ) : (
                        <p className="text-sm text-text-secondary flex-grow">Not in league table yet.</p>
                    )}
                    <Link to="/league" className="mt-2 inline-block text-accent hover:underline text-sm font-bold">View Full Table</Link>
                </div>

                {/* Finances */}
                <div className="glass-surface p-4">
                    <h2 className="text-lg font-display font-bold text-accent mb-3 uppercase">Finances</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-text-secondary uppercase">Transfer Budget</p>
                            <p className="text-2xl font-bold text-text-emphasis">${club.transfer_budget.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary uppercase">Wage Budget Remaining</p>
                            <p className="text-2xl font-bold text-text-emphasis">${club.wage_budget.toLocaleString()}</p>
                        </div>
                         <Link to="/finances" className="mt-2 pt-2 inline-block text-accent hover:underline text-sm font-bold">View Details</Link>
                    </div>
                </div>
            </div>
            <ManagerCat />
        </div>
    );
};

export default Dashboard;
