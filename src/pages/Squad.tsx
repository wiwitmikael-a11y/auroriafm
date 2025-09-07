import React, { useState, useMemo } from 'react';
import PlayerProfile from '../components/PlayerProfile';
import { useWorld } from '../contexts/WorldContext';
import { Player, Morale } from '../types';
import NationFlag from '../components/NationFlag';
import StarRating from '../components/StarRating';
import { TRAITS } from '../data/traits';

type SortableKeys = keyof Pick<Player, 'current_ability' | 'value' | 'morale'> | 'name';

const moraleOrder: Record<Morale, number> = { 'Very High': 5, 'High': 4, 'Good': 3, 'Fair': 2, 'Poor': 1, 'Low': 0 };

const Squad: React.FC = () => {
    const { players, managerClubId, updatePlayer, findClubById } = useWorld();
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' }>({ key: 'current_ability', direction: 'desc' });

    const squadPlayers = useMemo(() => {
        let sortableItems = players.filter(p => p.club_id === managerClubId);

        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aValue: any, bValue: any;
                
                switch (sortConfig.key) {
                    case 'name':
                        aValue = a.name.last;
                        bValue = b.name.last;
                        break;
                    case 'morale':
                        aValue = moraleOrder[a.morale];
                        bValue = moraleOrder[b.morale];
                        break;
                    default:
                        aValue = a[sortConfig.key as keyof Player];
                        bValue = b[sortConfig.key as keyof Player];
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [players, managerClubId, sortConfig]);

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

    const handleUpdatePlayer = (player: Player) => {
        updatePlayer(player);
        // Also update the selected player in the modal
        setSelectedPlayer(player);
    }

    return (
        <>
            <div className="animate-fade-in h-full flex flex-col">
                <div className="mb-6 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{ textShadow: '0 0 10px var(--color-accent)' }}>Squad</h1>
                            <p className="text-md text-text-secondary">Your current roster for {findClubById(managerClubId)?.name}.</p>
                        </div>
                    </div>
                </div>

                <div className="flex-grow glass-surface overflow-y-auto min-h-0">
                    <table>
                        <thead>
                            <tr>
                                <th className="sortable" onClick={() => requestSort('name')}>Info{getSortIndicator('name')}</th>
                                <th className="sortable" onClick={() => requestSort('morale')}>Morale{getSortIndicator('morale')}</th>
                                <th>Trait</th>
                                <th className="sortable" onClick={() => requestSort('value')}>Value{getSortIndicator('value')}</th>
                                <th className="sortable" onClick={() => requestSort('current_ability')}>Ability{getSortIndicator('current_ability')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {squadPlayers.map(player => (
                                <tr key={player.id} onClick={() => setSelectedPlayer(player)}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <NationFlag nationId={player.nation_id} />
                                            <span className="font-bold">{player.name.first} {player.name.last}</span>
                                        </div>
                                        <div className="text-xs text-text-secondary mt-1">
                                            {player.age} y/o | {player.position}
                                        </div>
                                    </td>
                                    <td>{player.morale}</td>
                                    <td className="text-xs">{TRAITS[player.traits[0]]?.name || 'Versatile'}</td>
                                    <td>${player.value.toLocaleString()}</td>
                                    <td>
                                        <StarRating 
                                            currentAbility={player.current_ability} 
                                            potentialAbility={player.potential_ability} 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedPlayer && (
                <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                         <button onClick={() => setSelectedPlayer(null)} className="modal-close-button" aria-label="Close player profile">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <PlayerProfile player={selectedPlayer} onUpdatePlayer={handleUpdatePlayer} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Squad;