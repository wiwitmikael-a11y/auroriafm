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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-surface p-6">
                     <h2 className="text-xl font-display font-bold text-accent mb-4">Team Training Focus</h2>
                     <div className="space-y-4">
                        <p className="text-sm text-text-secondary">Set the primary focus for team training sessions this week.</p>
                        <select className="w-full">
                            <option>Balanced</option>
                            <option>Attacking Movement</option>
                            <option>Defensive Positioning</option>
                            <option>Set Pieces</option>
                            <option>Physical Conditioning</option>
                        </select>
                        <button className="button-primary w-full">Confirm Focus</button>
                     </div>
                </div>
                 <div className="glass-surface p-6">
                     <h2 className="text-xl font-display font-bold text-accent mb-4">Individual Training</h2>
                     <p className="text-sm text-text-secondary">Assign individual players to focus on specific attributes or learn new traits. (Feature coming soon)</p>
                </div>
            </div>
             <div className="mt-4 glass-surface">
                 <table>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Position</th>
                            <th>Focus</th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {squadPlayers.slice(0, 10).map(player => (
                             <tr key={player.id}>
                                <td>{player.name.first} {player.name.last}</td>
                                <td>{player.position}</td>
                                <td>Balanced</td>
                                <td className="text-green-400">Good</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
    );
};

export default Training;
