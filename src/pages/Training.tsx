import React, { useState } from 'react';
import { useWorld } from '../contexts/WorldContext';
import { Player } from '../types';
import StarRating from '../components/StarRating';
import NationFlag from '../components/NationFlag';

const Training: React.FC = () => {
    const { players, managerClubId, updatePlayer } = useWorld();
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    const squadPlayers = players.filter(p => p.club_id === managerClubId);

    const handleSetFocus = (focus: { type: string; value: string } | null) => {
        if (selectedPlayer) {
            const updatedPlayer = { ...selectedPlayer, training_focus: focus };
            updatePlayer(updatedPlayer);
            setSelectedPlayer(updatedPlayer);
        }
    };

    const attributeGroups = ['Physical', 'Technical', 'Mental', 'Arcane'];

    return (
        <div className="animate-fade-in flex h-full gap-4">
            <div className="w-1/2 flex flex-col">
                <div className="mb-6 flex-shrink-0">
                    <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Training</h1>
                    <p className="text-md text-text-secondary">Develop your players and hone their skills.</p>
                </div>
                <div className="glass-surface overflow-y-auto flex-grow min-h-0">
                     <table className="w-full">
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Ability</th>
                                <th>Current Focus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {squadPlayers.map(player => (
                                <tr key={player.id} onClick={() => setSelectedPlayer(player)} className={`cursor-pointer ${selectedPlayer?.id === player.id ? 'highlighted-row' : ''}`}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <NationFlag nationId={player.nation_id} />
                                            <div>
                                                <p className="font-bold">{player.name.first} {player.name.last}</p>
                                                <p className="text-xs text-text-secondary">{player.position}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td><StarRating currentAbility={player.current_ability} potentialAbility={player.potential_ability} /></td>
                                    <td className="text-xs">{player.training_focus ? `${player.training_focus.type}: ${player.training_focus.value}` : 'None'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="w-1/2">
                 <div className="glass-surface p-6 h-full mt-20">
                    {selectedPlayer ? (
                        <div>
                            <h2 className="text-xl font-bold text-accent mb-4">Set Training Focus for {selectedPlayer.name.last}</h2>
                            <p className="text-sm text-text-secondary mb-4">
                                Current Focus: <span className="font-bold text-text-primary">{selectedPlayer.training_focus ? `${selectedPlayer.training_focus.type}: ${selectedPlayer.training_focus.value}` : 'None'}</span>
                            </p>
                            
                            <h3 className="font-bold text-text-emphasis mb-2">Attribute Groups</h3>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {attributeGroups.map(group => (
                                    <button key={group} onClick={() => handleSetFocus({ type: 'Attribute Group', value: group })} className="button-primary">
                                        Focus {group}
                                    </button>
                                ))}
                            </div>

                            <button onClick={() => handleSetFocus(null)} className="w-full button-primary" style={{backgroundColor: 'var(--color-danger)'}}>
                                Remove Focus
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-text-secondary">Select a player to set their training focus.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Training;
