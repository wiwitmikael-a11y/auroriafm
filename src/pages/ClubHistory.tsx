import React from 'react';
import { useWorld } from '../contexts/WorldContext';

const ClubHistory: React.FC = () => {
    const { findClubById, managerClubId } = useWorld();
    const club = findClubById(managerClubId);

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Club History</h1>
                <p className="text-md text-text-secondary">The legacy of {club?.name}.</p>
            </div>
            
            <div className="glass-surface p-6">
                <h2 className="text-xl font-display font-bold text-accent mb-4">Trophy Cabinet</h2>
                <p className="text-sm text-text-secondary">No major trophies won yet. The future is unwritten.</p>
            </div>
        </div>
    );
};

export default ClubHistory;