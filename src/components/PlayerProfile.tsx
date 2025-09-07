import React, { useState, useEffect } from 'react';
import { Player, PlayerAttributes, Morale, Personality } from '../types';
import AnimatedSprite from './AnimatedSprite';
import NationFlag from './NationFlag';
import RadarChart from './RadarChart';
import StarRating from './StarRating';
import { TRAITS } from '../data/traits';
import { geminiService } from '../services/geminiService';
import { useWorld } from '../contexts/WorldContext';
import { getAttributeColorClass, getScoutedAttributeDisplay } from '../utils/attributeUtils';
import { PLAYSTYLES } from '../data/playstyles';

interface AttributeGroupProps {
    title: string;
    attributes: [keyof PlayerAttributes, number][];
    scoutingKnowledge: number;
}

const AttributeGroup: React.FC<AttributeGroupProps> = ({ title, attributes, scoutingKnowledge }) => (
    <div className="glass-surface p-3 rounded-md">
        <h3 className="text-md font-bold text-accent mb-2 uppercase tracking-wider">{title}</h3>
        <div className="flex flex-col space-y-1 text-base">
            {attributes.map(([key, value]) => {
                const { display } = getScoutedAttributeDisplay(value, scoutingKnowledge);
                const colorClass = scoutingKnowledge < 100 ? 'text-text-secondary' : getAttributeColorClass(value);
                return (
                    // FIX: Cast `key` to a string for the `key` prop and `replace` method.
                    <div key={String(key)} className="grid grid-cols-3 items-center gap-2">
                        <span className="uppercase text-text-secondary attribute-label col-span-2">{String(key).replace(/_/g, ' ')}</span>
                        <span className={`font-bold ${colorClass} text-right`}>{display}</span>
                    </div>
                );
            })}
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

const personalityStyles: { [key in Personality]: { text: string; color: string; bgColor: string } } = {
    'Ambitious': { text: 'Ambitious', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
    'Loyal': { text: 'Loyal', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)' },
    'Professional': { text: 'Professional', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
    'Temperamental': { text: 'Temperamental', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
};


interface PlayerProfileProps {
    player: Player;
    onUpdatePlayer: (player: Player) => void;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ player, onUpdatePlayer }) => {
    const { findClubById } = useWorld();
    const [activeTab, setActiveTab] = useState('Overview');
    const [isGeneratingLore, setIsGeneratingLore] = useState(false);
    
    const playstyle = PLAYSTYLES.find(p => p.id === player.playstyle_id);

    const handleGenerateLore = () => {
        setIsGeneratingLore(true);
        // Using setTimeout to give a feeling of processing, even though it's instant
        setTimeout(() => {
            try {
                const lore = geminiService.generatePlayerLore(player);
                onUpdatePlayer({ ...player, lore });
            } catch (error) {
                console.error("Error generating player lore:", error);
            } finally {
                setIsGeneratingLore(false);
            }
        }, 500);
    };

    const physicalAttrs: [keyof PlayerAttributes, number][] = [['speed', player.attributes.speed], ['stamina', player.attributes.stamina], ['strength', player.attributes.strength], ['aggression', player.attributes.aggression], ['injury_proneness', player.attributes.injury_proneness]];
    const technicalAttrs: [keyof PlayerAttributes, number][] = [['shooting', player.attributes.shooting], ['dribbling', player.attributes.dribbling], ['passing', player.attributes.passing], ['tackling', player.attributes.tackling]];
    const mentalAttrs: [keyof PlayerAttributes, number][] = [['composure', player.attributes.composure], ['vision', player.attributes.vision], ['consistency', player.attributes.consistency], ['important_matches', player.attributes.important_matches]];
    const magicalAttrs: [keyof PlayerAttributes, number][] = [['arcane_dribble', player.attributes.arcane_dribble], ['elemental_shot', player.attributes.elemental_shot], ['temporal_flux', player.attributes.temporal_flux]];

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
    const personalityInfo = personalityStyles[player.personality];
    
  return (
    <div className="h-full glass-surface p-4 flex flex-col overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-start gap-6 mb-4 pb-4 border-b border-border">
            {/* Portrait Column */}
            <div className="flex-shrink-0 w-64 h-64 flex items-center justify-center">
                <AnimatedSprite player={player} type="idle" className="w-full h-full" />
            </div>

            {/* Info Column */}
            <div className="flex-grow flex flex-col space-y-3">
                {/* Name Block */}
                <div>
                    <div className="flex items-center gap-2">
                        <NationFlag nationId={player.nation_id} className="w-5 h-5"/>
                        <h1 className="text-2xl font-display font-black text-text-emphasis">{player.name.first} {player.name.last}</h1>
                    </div>
                    {player.name.alias && <p className="text-md text-accent-secondary -mt-1">"{player.name.alias}"</p>}
                </div>
                
                {/* Details Block */}
                <div>
                    <p className="text-sm text-text-secondary">{player.age} y/o | {player.position} | {player.preferred_foot} Foot | {player.squad_status}</p>
                    <p className="text-sm text-text-secondary">Value: ${player.value.toLocaleString()}</p>
                </div>

                {/* Status Block */}
                <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">Morale:</span>
                        <span style={{color: moraleInfo.color, backgroundColor: moraleInfo.bgColor}} className="px-2 py-0.5 rounded-full text-xs font-bold">{moraleInfo.text}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">Personality:</span>
                        <span style={{color: personalityInfo.color, backgroundColor: personalityInfo.bgColor}} className="px-2 py-0.5 rounded-full text-xs font-bold">{personalityInfo.text}</span>
                    </div>
                </div>

                {/* Ability Block */}
                <div className="pt-2">
                    <p className="text-xs text-text-secondary mb-1">Ability</p>
                    <StarRating 
                        currentAbility={player.current_ability} 
                        potentialAbility={player.potential_ability} 
                    />
                </div>
            </div>
        </div>


        {/* Tabs */}
        <div className="flex border-b border-border mb-4">
            <button onClick={() => setActiveTab('Overview')} className={`py-2 px-4 text-sm font-bold ${activeTab === 'Overview' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary'}`}>Overview</button>
            <button onClick={() => setActiveTab('History')} className={`py-2 px-4 text-sm font-bold ${activeTab === 'History' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary'}`}>History & Lore</button>
        </div>
        
        {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side: Attribute groups spanning 2 columns */}
                <div className="lg:col-span-2">
                    <h3 className="text-md font-bold text-accent mb-2 uppercase tracking-wider">Attributes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AttributeGroup title="Physical" attributes={physicalAttrs} scoutingKnowledge={player.scouting_knowledge} />
                        <AttributeGroup title="Technical" attributes={technicalAttrs} scoutingKnowledge={player.scouting_knowledge} />
                        <AttributeGroup title="Mental" attributes={mentalAttrs} scoutingKnowledge={player.scouting_knowledge} />
                        <AttributeGroup title="Magical" attributes={magicalAttrs} scoutingKnowledge={player.scouting_knowledge} />
                    </div>
                </div>
                
                {/* Right side: Playstyle, Traits, Radar */}
                <div className="space-y-4">
                     <div>
                        <h3 className="text-md font-bold text-accent mb-2 uppercase tracking-wider">Playstyle</h3>
                        <div className="glass-surface p-3 rounded-md">
                            <p className="font-bold text-text-emphasis text-lg">{playstyle?.name}</p>
                            <p className="text-sm text-text-secondary italic mt-1">{playstyle?.description}</p>
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
                    <div className="w-full glass-surface p-2 rounded-md flex flex-col items-center">
                        <h3 className="text-md text-center font-bold text-accent uppercase tracking-wider">Attribute Hex</h3>
                        <RadarChart data={radarData} size={180}/>
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
    </div>
  );
};

export default PlayerProfile;
