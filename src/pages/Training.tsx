import React from 'react';
import { useWorld } from '../contexts/WorldContext';

const Training: React.FC = () => {
    const { players, managerClubId } = useWorld();
    const squadPlayers = players.filter(p => p.club_id === managerClubId);

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Training</h1>
                <p className="text-md text-text-secondary">Develop your players and hone your team's skills.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 glass-surface p-4">
                    <h2 className="text-xl font-display font-bold text-accent mb-4">Team Training</h2>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Weekly Focus</label>
                    <select className="w-full">
                        <option>Balanced</option>
                        <option>Attacking</option>
                        <option>Defending</option>
                        <option>Possession</option>
                        <option>Physical</option>
                    </select>
                </div>
                <div className="lg:col-span-2 glass-surface p-4">
                    <h2 className="text-xl font-display font-bold text-accent mb-4">Individual Focus</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {squadPlayers.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                                <p className="text-sm">{p.name.first} {p.name.last}</p>
                                <select defaultValue={p.individual_training_focus} className="bg-slate-800/50 border-none rounded p-1 text-xs">
                                    <option>None</option>
                                    <option>shooting</option>
                                    <option>dribbling</option>
                                    <option>passing</option>
                                    <option>tackling</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Training;