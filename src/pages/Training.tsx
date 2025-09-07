import React from 'react';
import { useWorld } from '../contexts/WorldContext';
import { PlayerAttributes, TeamTrainingFocus } from '../types';

const Training: React.FC = () => {
    const { players, managerClubId } = useWorld();
    const squadPlayers = players.filter(p => p.club_id === managerClubId);

    const trainingFocusOptions: TeamTrainingFocus[] = ['Balanced', 'Attacking', 'Defending', 'Possession', 'Physical', 'Magicka'];
    const individualFocusOptions: (keyof PlayerAttributes)[] = ['shooting', 'dribbling', 'passing', 'tackling', 'speed', 'strength', 'arcane_dribble'];

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Training</h1>
                <p className="text-md text-text-secondary">Develop your players and hone your team's skills.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 glass-surface p-4 flex flex-col">
                    <h2 className="text-xl font-display font-bold text-accent mb-4">Team Training</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Weekly Focus</label>
                            <select className="w-full">
                                {trainingFocusOptions.map(focus => <option key={focus}>{focus}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Intensity</label>
                             <input type="range" min="1" max="5" defaultValue="3" className="w-full" />
                        </div>
                    </div>
                     <div className="mt-auto pt-4 border-t border-border">
                        <h3 className="text-md font-bold text-text-emphasis mb-2">Team Cohesion</h3>
                        <div className="w-full bg-slate-900/50 rounded-full h-2.5">
                            <div className="bg-accent h-2.5 rounded-full" style={{width: '75%', boxShadow: '0 0 8px var(--color-accent)'}}></div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 glass-surface p-4 flex flex-col">
                    <h2 className="text-xl font-display font-bold text-accent mb-4">Individual Focus</h2>
                    <div className="flex-grow overflow-y-auto min-h-0">
                        <table>
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Focus</th>
                                </tr>
                            </thead>
                            <tbody>
                                {squadPlayers.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.name.first} {p.name.last}</td>
                                        <td>
                                            <select defaultValue={p.individual_training_focus} className="bg-slate-800/50 border-none rounded p-1 text-xs w-full">
                                                <option value="None">None</option>
                                                {individualFocusOptions.map(focus => <option key={focus} value={focus} className="capitalize">{focus.replace('_', ' ')}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Training;