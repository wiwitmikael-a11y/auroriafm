import React, { useState } from 'react';
import { Player, PlayerAttributes, Morale } from '../types';
import PlayerPortrait from './PlayerPortrait';
import NationFlag from './NationFlag';
import NicknameModal from './NicknameModal';
import RadarChart from './RadarChart';
import { TRAITS } from '../data/traits';
import { geminiService } from '../services/geminiService';
import { useWorld } from '../contexts/WorldContext';

const getScoutedAttributeDisplay = (value: number, knowledge: number): string => {
  if (knowledge >= 100) return String(value);
  if (knowledge <= 0) return '??';
  const uncertainty = Math.max(2, 20 - Math.floor(knowledge / 5));
  const min = Math.max(10, value - Math.floor(uncertainty / 2));
  const max = Math.min(99, value + Math.ceil(uncertainty / 2));
  return `${min}-${max}`;
}

interface AttributeGroupProps {
    title: string;
    attributes: [string, number][];
    scoutingKnowledge: number;
}

const AttributeGroup: React.FC<AttributeGroupProps> = ({ title, attributes, scoutingKnowledge }) => (
    <div className="glass-surface p-3 rounded-md">
        <h3 className="text-md font-bold text-accent mb-2 uppercase tracking-wider">{title}</h3>
        <div className="flex flex-col space-y-1 text-xs">
            {attributes.map(([key, value]) => (
                <div key={key} className="flex justify-between">
                    <span className="uppercase text-text-secondary attribute-label">{key.replace(/_/g, ' ')}</span>
                    <span className="font-bold text-text-emphasis">{getScoutedAttributeDisplay(value, scoutingKnowledge)}</span>
                </div>
            ))}
        </div>
    </div>
);

const moraleStyles: { [key in Morale]: { text: string; color: string; bgColor: string } } = {
    'Very High': { text: 'Very High', color: '#4ade80', bgColor: 'rgba(74, 222, 128, 0.1)' },
    'High': { text: 'High', color: '#86efac', bgColor: 'rgba(134, 239, 172, 0.1)' },
    'Good': { text: 'Good', color: '#a7f3d0', bgColor: 'rgba(167, 243, 208, 0.1)' },
    'Fair': { text: 'Fair', color: '#fde047', bgColor: 'rgba(253, 224, 71, 0.1)' },
    'Poor': { text: 'Poor', color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)' },
    'Low': { text: 'Low', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
};

interface PlayerProfileProps {
    player: Player;
    onUpdatePlayer: (player: Player) => void;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ player, onUpdatePlayer }) => {
    const { findClubById } = useWorld();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [isGeneratingLore, setIsGeneratingLore] = useState(false);

    const handleGenerateLore = async () => {
        setIsGeneratingLore(true);
        try {
            const lore = await geminiService.generatePlayerLore(player);
            onUpdatePlayer({ ...player, lore });
        } catch (error) {
            console.error("Error generating player lore:", error);
            // Optionally, set an error message to display to the user
        } finally {
            setIsGeneratingLore(false);
        }
    };

    const physicalAttrs: [string, number][] = [['speed', player.attributes.speed], ['stamina', player.attributes.stamina], ['strength', player.attributes.strength], ['aggression', player.attributes.aggression], ['injury_proneness', player.attributes.injury_proneness]];
    const technicalAttrs: [string, number][] = [['shooting', player.attributes.shooting], ['dribbling', player.attributes.dribbling], ['passing', player.attributes.passing], ['tackling', player.attributes.tackling]];
    const mentalAttrs: [string, number][] = [['composure', player.attributes.composure], ['vision', player.attributes.vision], ['consistency', player.attributes.consistency], ['important_matches', player.attributes.important_matches]];
    const magicalAttrs: [string, number][] = [['arcane_dribble', player.attributes.arcane_dribble], ['elemental_shot', player.attributes.elemental_shot], ['temporal_flux', player.attributes.temporal_flux]];

    const radarData = [
        { name: 'PHY', value: (player.attributes.speed + player.attributes.stamina + player.attributes.strength) / 3 },
        { name: 'MEN', value: (player.attributes.composure + player.attributes.vision) / 2 },
        { name: 'PAS', value: player.attributes.passing },
        { name: 'SHT', value: player.attributes.shooting },
        { name: 'DRI', value: player.attributes.dribbling },
        { name: 'DEF', value: player.attributes.tackling },
        { name: 'MAG', value: (player.attributes.arcane_dribble + player.attributes.elemental_shot) / 2 },
    ];
    
    const moraleInfo = moraleStyles[player.morale];

  return (
    <div className="h-full glass-surface p-4 flex flex-col overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4 pb-4 border-b border-border">
            <PlayerPortrait player={player} className="w-24 h-28 flex-shrink-0" />
            <div className="flex-grow space-y-1">
                <div className="flex items-center gap-2">
                    <NationFlag nationId={player.nation_id} className="w-5 h-5"/>
                    <h1 className="text-2xl font-display font-black text-text-emphasis">{player.name.first} {player.name.last}</h1>
                </div>
                {player.name.alias && <p className="text-md text-accent-secondary -mt-1">"{player.name.alias}"</p>}
                 <p className="text-sm font-bold text-accent">{player.playstyle}</p>
                <p className="text-sm text-text-secondary">{player.age} y/o | {player.position} | {player.preferred_foot} Foot | {player.squad_status}</p>
                <p className="text-sm text-text-secondary">Value: ${player.value.toLocaleString()}</p>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-text-secondary">Morale:</span>
                    <span style={{color: moraleInfo.color, backgroundColor: moraleInfo.bgColor}} className="px-2 py-0.5 rounded-full text-xs font-bold">{moraleInfo.text}</span>
                 </div>
                 <button onClick={() => setIsModalOpen(true)} className="mt-1 text-xs text-accent hover:underline">
                    Set Nickname
                </button>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="font-display font-black text-5xl text-text-emphasis">{getScoutedAttributeDisplay(player.current_ability, player.scouting_knowledge)}</p>
                <p className="text-xs text-text-secondary">Potential: {getScoutedAttributeDisplay(player.potential_ability, player.scouting_knowledge)}</p>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-4">
            <button onClick={() => setActiveTab('Overview')} className={`py-2 px-4 text-sm font-bold ${activeTab === 'Overview' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary'}`}>Overview</button>
            <button onClick={() => setActiveTab('History')} className={`py-2 px-4 text-sm font-bold ${activeTab === 'History' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary'}`}>History & Lore</button>
        </div>
        
        {activeTab === 'Overview' && (
            <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        <AttributeGroup title="Physical" attributes={physicalAttrs} scoutingKnowledge={player.scouting_knowledge} />
                        <AttributeGroup title="Technical" attributes={technicalAttrs} scoutingKnowledge={player.scouting_knowledge} />
                        <AttributeGroup title="Mental" attributes={mentalAttrs} scoutingKnowledge={player.scouting_knowledge} />
                        <AttributeGroup title="Magical" attributes={magicalAttrs} scoutingKnowledge={player.scouting_knowledge} />
                    </div>
                    <div className="flex flex-col items-center justify-center glass-surface p-2 rounded-md">
                        <h3 className="text-md font-bold text-accent mb-1 uppercase tracking-wider">Attribute Hex</h3>
                        <RadarChart data={radarData} size={280}/>
                    </div>
                </div>
                 <div>
                    <h3 className="text-md font-bold text-accent mb-2 uppercase tracking-wider">Traits</h3>
                    <div className="flex flex-wrap gap-2">
                        {player.traits.map(traitKey => {
                            const trait = TRAITS[traitKey];
                            return trait ? (
                                <div key={traitKey} className="glass-surface px-3 py-1 rounded-md text-xs font-semibold group relative">
                                    {trait.name}
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-900 border border-border p-2 rounded-md text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        {trait.description}
                                    </div>
                                </div>
                            ) : null;
                        })}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'History' && (
            <div className="space-y-6">
                <div>
                    <h3 className="text-md font-bold text-accent mb-2 uppercase tracking-wider">Player Backstory</h3>
                    {player.lore ? (
                         <p className="text-sm text-text-secondary whitespace-pre-wrap">{player.lore}</p>
                    ) : (
                        <div className="text-center glass-surface p-4">
                             <p className="text-sm text-text-secondary mb-3">No backstory has been generated for this player.</p>
                            <button onClick={handleGenerateLore} disabled={isGeneratingLore} className="button-primary">
                                {isGeneratingLore ? 'Generating...' : 'Generate Backstory'}
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-md font-bold text-accent mb-2 uppercase tracking-wider">Career History</h3>
                    <div className="glass-surface overflow-hidden">
                        <table>
                            <thead>
                                <tr>
                                    <th>Age</th>
                                    <th>Club</th>
                                    <th>Apps</th>
                                    <th>Goals</th>
                                    <th>Assists</th>
                                    <th>Cards</th>
                                </tr>
                            </thead>
                            <tbody>
                                {player.history.length > 0 ? [...player.history].reverse().map(entry => {
                                    const club = findClubById(entry.club_id);
                                    return (
                                        <tr key={`${entry.season}-${entry.club_id}`}>
                                            <td>{entry.season}</td>
                                            <td>{club ? club.name : 'Unknown Club'}</td>
                                            <td>{entry.appearances}</td>
                                            <td>{entry.goals}</td>
                                            <td>{entry.assists}</td>
                                            <td>{entry.cards}</td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={6} className="text-center text-text-secondary py-4">No career history logged.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

      {isModalOpen && (
        <NicknameModal player={player} onUpdatePlayer={onUpdatePlayer} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default PlayerProfile;