import React from 'react';
import { useWorld } from '../contexts/WorldContext';

const LeagueTable: React.FC = () => {
    const { managerClubId, leagueTable, findClubById } = useWorld();

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>League Table</h1>
                <p className="text-md text-text-secondary">Current standings in The Great Game.</p>
            </div>

            <div className="glass-surface overflow-hidden">
                <table>
                    <thead>
                        <tr>
                            <th>Pos</th>
                            <th>Club</th>
                            <th>P</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>GF</th>
                            <th>GA</th>
                            <th>GD</th>
                            <th>Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leagueTable.map(row => (
                            <tr key={row.club_id} className={row.club_id === managerClubId ? 'highlighted-row' : ''}>
                                <td className="font-bold">{row.pos}</td>
                                <td>{findClubById(row.club_id)?.name || 'Unknown Club'}</td>
                                <td>{row.p}</td>
                                <td>{row.w}</td>
                                <td>{row.d}</td>
                                <td>{row.l}</td>
                                <td>{row.gf}</td>
                                <td>{row.ga}</td>
                                <td>{row.gd}</td>
                                <td className="font-bold">{row.pts}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeagueTable;