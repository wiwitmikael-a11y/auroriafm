import React from 'react';
import { useWorld } from '../contexts/WorldContext';
import ClubCrest from '../components/ClubCrest';

const Fixtures: React.FC = () => {
    const { fixtures, gameDate, findClubById, managerClubId } = useWorld();

    const upcomingFixtures = fixtures
        .filter(f => f.day >= gameDate.day)
        .sort((a, b) => a.day - b.day);

    const pastFixtures = fixtures
        .filter(f => f.day < gameDate.day)
        .sort((a, b) => b.day - a.day);

    const renderFixture = (fixture: any) => {
        const homeTeam = findClubById(fixture.home_team_id);
        const awayTeam = findClubById(fixture.away_team_id);
        if (!homeTeam || !awayTeam) return null;

        const isManagerTeam = homeTeam.id === managerClubId || awayTeam.id === managerClubId;

        return (
            <div key={`${fixture.day}-${homeTeam.id}`} className={`glass-surface p-3 ${isManagerTeam ? 'border-l-4 border-accent' : ''}`}>
                <p className="text-xs text-text-secondary mb-2">Season {gameDate.season}, Day {fixture.day}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 w-2/5">
                        <ClubCrest clubId={homeTeam.id} className="w-8 h-8"/>
                        <span className="font-bold">{homeTeam.name}</span>
                    </div>
                    <div className="text-center font-display font-black text-xl text-accent">VS</div>
                     <div className="flex items-center gap-2 w-2/5 justify-end">
                        <span className="font-bold text-right">{awayTeam.name}</span>
                        <ClubCrest clubId={awayTeam.id} className="w-8 h-8"/>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Fixtures</h1>
                <p className="text-md text-text-secondary">Your upcoming schedule and past results.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-xl font-display font-bold text-accent mb-3">Upcoming Matches</h2>
                    <div className="space-y-3">
                        {upcomingFixtures.slice(0, 10).map(renderFixture)}
                    </div>
                </div>
                 <div>
                    <h2 className="text-xl font-display font-bold text-accent mb-3">Recent Results</h2>
                     <div className="space-y-3">
                        {pastFixtures.length > 0 
                            ? pastFixtures.slice(0, 10).map(renderFixture) 
                            : <p className="text-sm text-text-secondary glass-surface p-3">No matches played yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Fixtures;
