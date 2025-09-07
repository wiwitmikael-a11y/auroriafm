import React from 'react';
import { useWorld } from '../contexts/WorldContext';

const Finances: React.FC = () => {
    const { findClubById, managerClubId } = useWorld();
    const club = findClubById(managerClubId);

    if (!club) return null;

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Finances</h1>
                <p className="text-md text-text-secondary">An overview of the club's financial health.</p>
            </div>

            <div className="glass-surface p-6">
                <h2 className="text-xl font-display font-bold text-accent mb-4">Budget Overview</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-text-secondary">Overall Balance</p>
                        <p className="text-3xl font-bold text-green-400">$10,450,000</p>
                    </div>
                     <div>
                        <p className="text-sm text-text-secondary">Financial Status</p>
                        <p className="text-3xl font-bold text-text-emphasis">{club.finances}</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Transfer Budget Remaining</p>
                        <p className="text-3xl font-bold text-text-emphasis">${club.transfer_budget.toLocaleString()}</p>
                    </div>
                     <div>
                        <p className="text-sm text-text-secondary">Wage Budget Remaining</p>
                        <p className="text-3xl font-bold text-text-emphasis">${club.wage_budget.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Finances;