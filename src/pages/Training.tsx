import React from 'react';
import { useWorld } from '../contexts/WorldContext';
import { Player, TrainingFocus, PlayerAttributes } from '../types';

const attributeGroups: { label: string; value: TrainingFocus['value'] }[] = [
    { label: 'Physical', value: 'Physical' },
    { label: 'Technical', value: 'Technical' },
    { label: 'Mental', value: 'Mental' },
    { label: 'Magical', value: 'Magical' },
];

const individualAttributes: { label: string; value: keyof PlayerAttributes }[] = [
    { label: 'Speed', value: 'speed' },
    { label: 'Stamina', value: 'stamina' },
    { label: 'Strength', value: 'strength' },
    { label: 'Shooting', value: 'shooting' },
    { label: 'Dribbling', value: 'dribbling' },
    { label: 'Passing', value: 'passing' },
    { label: 'Tackling', value: 'tackling' },
    { label: 'Composure', value: 'composure' },
    { label: 'Vision', value: 'vision' },
    { label: 'Arcane Dribble', value: 'arcane_dribble' },
    { label: 'Elemental Shot', value: 'elemental_shot' },
];


const Training: React.FC = () => {
    const { players, managerClubId, updatePlayer } = useWorld();
    const squadPlayers = players.filter(p => p.club_id === managerClubId).sort((a,b) => b.current_ability - a.current_ability);

    const handleFocusChange = (playerId: string, focusString: string) => {
        const player = players.find(p => p.id === playerId);
        if (!player) return;

        if (focusString === "None") {
            updatePlayer({ ...player, training_focus: null });
            return;
        }

        const [type, value] = focusString.split(':');
        let newFocus: TrainingFocus | null = null;
        if (type === 'Group') {
            newFocus = { type: 'Attribute Group', value: value as any };
        } else if (type === 'Attribute') {
            newFocus = { type: 'Individual Attribute', value: value as keyof PlayerAttributes };
        }
        
        if (newFocus) {
            updatePlayer({ ...player, training_focus: newFocus });
        }
    };

    const getPlayerFocusString = (player: Player): string => {
        if (!player.training_focus) return "None";
        if (player.training_focus.type === 'Attribute Group') {
            return `Group:${player.training_focus.value}`;
        }
        return `Attribute:${player.training_focus.value}`;
    }

    return (
        <div className="animate-fade-in h-full flex flex-col">
            <div className="mb-6 flex-shrink-0">
                <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Training</h1>
                <p className="text-md text-text-secondary">Develop your players and hone your team's skills.</p>
            </div>

            <div className="glass-surface p-6 mb-4 flex-shrink-0">
                 <h2 className="text-xl font-display font-bold text-accent mb-4">Team Training Focus</h2>
                 <div className="space-y-4">
                    <p className="text-sm text-text-secondary">Set the primary focus for team training sessions this week. This provides a small chance of improvement for all players in the chosen area.</p>
                    <select className="w-full">
                        <option>Balanced</option>
                        <option>Attacking Movement</option>
                        <option>Defensive Positioning</option>
                        <option>Set Pieces</option>
                        <option>Physical Conditioning</option>
                    </select>
                 </div>
            </div>
            
             <div className="flex-grow glass-surface min-h-0">
                <div className="h-full overflow-y-auto">
                    <table>
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Age</th>
                                <th>Pos</th>
                                <th>Ability</th>
                                <th className="w-1/3">Individual Focus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {squadPlayers.map(player => (
                                 <tr key={player.id}>
                                    <td>{player.name.first} {player.name.last}</td>
                                    <td>{player.age}</td>
                                    <td>{player.position}</td>
                                    <td className="font-bold">{player.current_ability}</td>
                                    <td>
                                        <select 
                                            className="w-full !my-1" 
                                            value={getPlayerFocusString(player)}
                                            onChange={(e) => handleFocusChange(player.id, e.target.value)}
                                        >
                                            <option value="None">None</option>
                                            <optgroup label="Attribute Groups">
                                                {attributeGroups.map(g => <option key={g.value} value={`Group:${g.value}`}>{g.label}</option>)}
                                            </optgroup>
                                             <optgroup label="Attributes">
                                                {/* FIX: Cast a.value to string for the key prop. */}
                                                {individualAttributes.map(a => <option key={String(a.value)} value={`Attribute:${a.value}`}>{a.label}</option>)}
                                            </optgroup>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    );
};

export default Training;
