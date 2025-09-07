import React from 'react';
import { useWorld } from '../contexts/WorldContext';
import PlayerCard from '../components/PlayerCard';

const Transfers: React.FC = () => {
    const { players, managerClubId } = useWorld();
    
    // For demonstration, just shows all players not at the manager's club.
    const transferTargets = players.filter(p => p.club_id !== managerClubId);

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Transfer Market</h1>
                <p className="text-md text-text-secondary">Search for new talent to bolster your squad.</p>
            </div>
            
            <div className="mb-6 p-4 glass-surface">
                <input 
                    type="text"
                    placeholder="Search player name..."
                    className="w-full"
                />
            </div>

            <div className="space-y-3">
                {transferTargets.slice(0, 20).map(player => (
                    <PlayerCard 
                        key={player.id} 
                        player={player} 
                        onSelectPlayer={() => { /* Implement player selection/scouting */}}
                        isSelected={false}
                    />
                ))}
            </div>
        </div>
    );
};

export default Transfers;