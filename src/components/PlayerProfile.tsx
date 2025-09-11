import React, { useState, useMemo, useEffect } from 'react';
import { Player } from '../types';
import { useWorld } from '../contexts/WorldContext';
import PlayerPortrait from './PlayerPortrait';
import NationFlag from './NationFlag';
import StarRating from './StarRating';
import { geminiService } from '../services/geminiService';
import RadarChart from './RadarChart';
import NicknameModal from './NicknameModal';
import { getAttributeColorClass, getScoutedAttributeDisplay } from '../utils/attributeUtils';
import { TRAITS } from '../data/traits';

interface PlayerProfileProps {
  player: Player;
  onUpdatePlayer: (player: Player) => void;
}

// Moved attribute arrays outside the component to prevent re-creation on every render
const physicalAttrs = ['speed', 'stamina', 'strength', 'aggression'];
const technicalAttrs = ['shooting', 'dribbling', 'passing', 'tackling'];
const mentalAttrs = ['composure', 'vision', 'consistency', 'important_matches'];
const arcaneAttrs = ['arcane_dribble', 'elemental_shot', 'temporal_flux'];

const PlayerProfile: React.FC<PlayerProfileProps> = ({ player, onUpdatePlayer }) => {
    const { findClubById } = useWorld();
    const [lore, setLore] = useState<string>('');
    const [isGeneratingLore, setIsGeneratingLore] = useState(true);
    const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);

    const club = findClubById(player.club_id);
    
    useEffect(() => {
        const fetchLore = async () => {
            setIsGeneratingLore(true);
            setLore(''); // Clear previous lore
            try {
                const generatedLore = await geminiService.generatePlayerLore(player);
                setLore(generatedLore);
            } catch (error) {
                console.error("Error fetching player lore:", error);
                setLore("The Chroniclers' records on this player are currently unavailable due to a disturbance in the aether.");
            } finally {
                setIsGeneratingLore(false);
            }
        };

        fetchLore();
    }, [player]);

    const radarData = useMemo(() => [
        { name: 'PHY', value: physicalAttrs.reduce((sum, key) => sum + player.attributes[key], 0) / physicalAttrs.length },
        { name: 'TEC', value: technicalAttrs.reduce((sum, key) => sum + player.attributes[key], 0) / technicalAttrs.length },
        { name: 'MEN', value: mentalAttrs.reduce((sum, key) => sum + player.attributes[key], 0) / mentalAttrs.length },
        { name: 'ARC', value: arcaneAttrs.reduce((sum, key) => sum + player.attributes[key], 0) / arcaneAttrs.length },
    ], [player.attributes]); // FIX: Simplified dependencies to only what's necessary
    
    const renderAttribute = (attr: string) => {
        const value = player.attributes[attr];
        const { display } = getScoutedAttributeDisplay(value, player.scouting_knowledge);
        const colorClass = getAttributeColorClass(value);

        return (
             <div key={attr} className="flex justify-between items-center text-sm">
                <span className="text-text-secondary capitalize">{attr.replace(/_/g, ' ')}</span>
                <span className={`font-bold ${colorClass}`}>{display}</span>
            </div>
        );
    }
    
    return (
        <>
            <div className="p-4 bg-slate-950/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Portrait & Vitals */}
                    <div className="md:col-span-1 flex flex-col items-center text-center">
                        <PlayerPortrait player={player} className="w-40 h-40 mb-4" />
                        <h1 className="text-2xl font-bold text-text-emphasis leading-tight">{player.name.first} {player.name.alias && `"${player.name.alias}"`} {player.name.last}</h1>
                        <button onClick={() => setIsNicknameModalOpen(true)} className="text-xs text-accent hover:underline">(Generate Nickname)</button>
                        <div className="flex items-center gap-2 mt-2">
                           <NationFlag nationId={player.nation_id} />
                           <p className="text-md text-text-secondary">{player.age} y/o | {player.position} | {club?.name}</p>
                        </div>
                        <div className="my-3">
                           <StarRating currentAbility={player.current_ability} potentialAbility={player.potential_ability} />
                        </div>
                        <p className="text-2xl font-bold text-text-emphasis">${player.value.toLocaleString()}</p>
                        <p className="text-xs text-text-secondary">Estimated Value</p>
                    </div>

                    {/* Middle Column: Attributes & Radar */}
                    <div className="md:col-span-1">
                         <div className="flex justify-center mb-2">
                            <RadarChart data={radarData} size={180} />
                         </div>
                         <div className="grid grid-cols-2 gap-x-6 text-xs">
                             <div>
                                <h3 className="font-bold text-accent mb-1 uppercase">Physical</h3>
                                {physicalAttrs.map(renderAttribute)}
                             </div>
                              <div>
                                <h3 className="font-bold text-accent mb-1 uppercase">Technical</h3>
                                {technicalAttrs.map(renderAttribute)}
                             </div>
                             <div className="mt-2">
                                <h3 className="font-bold text-accent mb-1 uppercase">Mental</h3>
                                {mentalAttrs.map(renderAttribute)}
                             </div>
                             <div className="mt-2">
                                <h3 className="font-bold text-accent mb-1 uppercase">Arcane</h3>
                                {arcaneAttrs.map(renderAttribute)}
                             </div>
                         </div>
                    </div>
                    
                    {/* Right Column: Lore & Traits */}
                    <div className="md:col-span-1 flex flex-col">
                        <div>
                             <h3 className="text-lg font-bold text-accent mb-2 uppercase">Chronicler's Report</h3>
                             <p className={`text-sm text-text-secondary mb-4 italic ${isGeneratingLore ? 'animate-pulse' : ''}`}>
                                {isGeneratingLore ? "The Chroniclers are consulting their archives..." : lore}
                             </p>
                        </div>
                        <div className="mt-4 border-t border-border pt-3">
                            <h3 className="text-lg font-bold text-accent mb-2 uppercase">Traits</h3>
                            <div className="space-y-2">
                                {player.traits.map(traitKey => {
                                    const trait = TRAITS[traitKey];
                                    return (
                                        <div key={traitKey}>
                                            <p className="font-bold text-text-primary text-sm">{trait?.name || traitKey}</p>
                                            <p className="text-xs text-text-secondary">{trait?.description || "A unique skill."}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isNicknameModalOpen && (
                <NicknameModal 
                    player={player}
                    onUpdatePlayer={onUpdatePlayer}
                    onClose={() => setIsNicknameModalOpen(false)}
                />
            )}
        </>
    );
};

export default PlayerProfile;