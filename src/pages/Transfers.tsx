import React, { useState, useMemo } from 'react';
import { useWorld } from '../contexts/WorldContext';
import { Player, Rarity } from '../types';
import NationFlag from '../components/NationFlag';
import PlayerDetailModal from '../components/PlayerDetailModal';
import { NATIONS } from '../data/nations';

type SortableKeys = keyof Pick<Player, 'age' | 'current_ability' | 'value' | 'scouting_knowledge'> | 'name';

const Transfers: React.FC = () => {
    const { players, managerClubId } = useWorld();
    const [filters, setFilters] = useState({ name: '', position: 'Any', maxAge: 40, minValue: 0, rarity: 'Any', nationId: 'Any' });
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' }>({ key: 'current_ability', direction: 'desc' });
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    
    const rarities: Rarity[] = ['Common', 'Rare', 'Epic', 'Legend'];

    const transferTargets = useMemo(() => {
        let sortableItems = players
            .filter(p => p.club_id !== managerClubId)
            .filter(p => {
                const nameMatch = p.name.first.toLowerCase().includes(filters.name.toLowerCase()) || p.name.last.toLowerCase().includes(filters.name.toLowerCase());
                const posMatch = filters.position === 'Any' || p.position === filters.position;
                const ageMatch = p.age <= filters.maxAge;
                const valueMatch = p.value >= filters.minValue;
                const rarityMatch = filters.rarity === 'Any' || p.rarity === filters.rarity;
                const nationMatch = filters.nationId === 'Any' || p.nation_id === filters.nationId;
                return nameMatch && posMatch && ageMatch && valueMatch && rarityMatch && nationMatch;
            });

        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aValue, bValue;
                if (sortConfig.key === 'name') {
                    aValue = a.name.last;
                    bValue = b.name.last;
                } else {
                    aValue = a[sortConfig.key as keyof Player] as number;
                    bValue = b[sortConfig.key as keyof Player] as number;
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [players, managerClubId, filters, sortConfig]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const requestSort = (key: SortableKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: SortableKeys) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    };

    return (
        <>
            <div className="animate-fade-in h-full flex flex-col">
                <div className="mb-6 flex-shrink-0">
                    <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Transfer Market</h1>
                    <p className="text-md text-text-secondary">Search for new talent to bolster your squad.</p>
                </div>
                
                <div className="mb-6 p-4 glass-surface flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <input 
                            type="text"
                            name="name"
                            placeholder="Search player name..."
                            className="w-full lg:col-span-2"
                            onChange={handleFilterChange}
                        />
                         <select name="position" className="w-full" onChange={handleFilterChange} value={filters.position}>
                            <option>Any</option>
                            <option>GK</option>
                            <option>DF</option>
                            <option>MF</option>
                            <option>FW</option>
                        </select>
                        <select name="rarity" className="w-full" onChange={handleFilterChange} value={filters.rarity}>
                            <option>Any</option>
                            {rarities.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <select name="nationId" className="w-full" onChange={handleFilterChange} value={filters.nationId}>
                            <option value="Any">Any Nation</option>
                            {NATIONS.map(n => <option key={n.id} value={n.id}>{n.adjective}</option>)}
                        </select>
                        <div>
                            <label className="text-xs text-text-secondary">Max Age: {filters.maxAge}</label>
                            <input type="range" name="maxAge" min="16" max="40" value={filters.maxAge} onChange={handleFilterChange} />
                        </div>
                         <div className="lg:col-span-2">
                            <label className="text-xs text-text-secondary">Min Value: ${Number(filters.minValue).toLocaleString()}</label>
                            <input type="range" name="minValue" min="0" max="10000000" step="100000" value={filters.minValue} onChange={handleFilterChange} />
                        </div>
                    </div>
                </div>

                <div className="flex-grow glass-surface overflow-y-auto min-h-0">
                    <table>
                        <thead>
                            <tr>
                                <th className="sortable" onClick={() => requestSort('name')}>Name{getSortIndicator('name')}</th>
                                <th className="sortable" onClick={() => requestSort('age')}>Age{getSortIndicator('age')}</th>
                                <th>Pos</th>
                                <th className="sortable" onClick={() => requestSort('current_ability')}>Ability{getSortIndicator('current_ability')}</th>
                                <th className="sortable" onClick={() => requestSort('value')}>Value{getSortIndicator('value')}</th>
                                <th className="sortable" onClick={() => requestSort('scouting_knowledge')}>Scouted{getSortIndicator('scouting_knowledge')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transferTargets.slice(0, 100).map(player => (
                                <tr key={player.id} className="hover:bg-cyan-500/10 cursor-pointer" onClick={() => setSelectedPlayer(player)}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <NationFlag nationId={player.nation_id}/>
                                            <span>{player.name.first} {player.name.last}</span>
                                        </div>
                                    </td>
                                    <td>{player.age}</td>
                                    <td>{player.position}</td>
                                    <td className="font-bold">{player.scouting_knowledge < 100 ? '?' : player.current_ability}</td>
                                    <td>${player.value.toLocaleString()}</td>
                                    <td>{player.scouting_knowledge}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedPlayer && (
                <PlayerDetailModal 
                    player={selectedPlayer} 
                    onClose={() => setSelectedPlayer(null)} 
                />
            )}
        </>
    );
};

export default Transfers;