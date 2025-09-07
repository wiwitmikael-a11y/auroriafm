import React, { useMemo } from 'react';
import { useWorld } from '../contexts/WorldContext';
import { CLUBS } from '../data/clubs';
import { LeagueTableRow } from '../types';

const LeagueTable: React.FC = () => {
    const { managerClubId } = useWorld();
    
    // Using mock data for demonstration as league simulation is not implemented.
    const mockTable: LeagueTableRow[] = useMemo(() => CLUBS.map((club, index) => ({
        pos: index + 1,
        club_id: club.id,
        p: 5,
        w: 3,
        d: 1,
        l: 1,
        gf: Math.floor(Math.random() * 15) + 5,
        ga: Math.floor(Math.random() * 10),
        gd: 5, // This will be recalculated
        pts: (3*3 + 1*1),
        form: ['W', 'W', 'D', 'L', 'W'] as ('W' | 'D' | 'L')[],
    })).map(row => ({...row, gd: row.gf - row.ga})).sort((a,b) => b.pts - a.pts || b.gd - a.gd)
      .map((row, index) => ({...row, pos: index + 1})), []);

    const findClubName = (id: string) => CLUBS.find(c => c.id === id)?.name || 'Unknown Club';

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
                        {mockTable.map(row => (
                            <tr key={row.club_id} className={row.club_id === managerClubId ? 'highlighted-row' : ''}>
                                <td className="font-bold">{row.pos}</td>
                                <td>{findClubName(row.club_id)}</td>
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