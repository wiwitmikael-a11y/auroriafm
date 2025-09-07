import React, { useState } from 'react';
import { Player, PlayerAttributes } from '../types';
import PlayerPortrait from './PlayerPortrait';
import NationFlag from './NationFlag';
import NicknameModal from './NicknameModal';
import RadarChart from './RadarChart';

interface AttributeGroupProps {
    title: string;
    attributes: Partial<PlayerAttributes>;
}

const AttributeGroup: React.FC<AttributeGroupProps> = ({ title, attributes }) => (
    <div className="glass-surface p-3 rounded-md">
        <h3 className="text-md font-bold text-accent mb-2 uppercase tracking-wider">{title}</h3>
        <div className="flex flex-col space-y-1 text-xs">
            {Object.entries(attributes).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                    <span className="uppercase text-text-secondary attribute-label">{key.replace(/_/g, ' ')}</span>
                    <span className="font-bold text-text-emphasis">{value}</span>
                </div>
            ))}
        </div>
    </div>
);

// FIX: Define PlayerProfileProps interface
interface PlayerProfileProps {
    player: Player;
    onUpdatePlayer: (player: Player) => void;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ player, onUpdatePlayer }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const physicalAttrs = { speed: player.attributes.speed, stamina: player.attributes.stamina, strength: player.attributes.strength, aggression: player.attributes.aggression };
    const technicalAttrs = { shooting: player.attributes.shooting, dribbling: player.attributes.dribbling, passing: player.attributes.passing, tackling: player.attributes.tackling };
    const mentalAttrs = { composure: player.attributes.composure, vision: player.attributes.vision, consistency: player.attributes.consistency, important_matches: player.attributes.important_matches };
    const magicalAttrs = { arcane_dribble: player.attributes.arcane_dribble, elemental_shot: player.attributes.elemental_shot, temporal_flux: player.attributes.temporal_flux };

    const radarData = [
        { name: 'PHY', value: (physicalAttrs.speed + physicalAttrs.stamina + physicalAttrs.strength) / 3 },
        { name: 'MEN', value: (mentalAttrs.composure + mentalAttrs.vision) / 2 },
        { name: 'PAS', value: technicalAttrs.passing },
        { name: 'SHT', value: technicalAttrs.shooting },
        { name: 'DRI', value: technicalAttrs.dribbling },
        { name: 'DEF', value: technicalAttrs.tackling },
        { name: 'MAG', value: (magicalAttrs.arcane_dribble + magicalAttrs.elemental_shot) / 2 },
    ];


  return (
    <div className="h-full glass-surface p-4 flex flex-col overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4 pb-4 border-b border-border">
            <PlayerPortrait player={player} className="w-24 h-28 flex-shrink-0" />
            <div className="flex-grow">
                <div className="flex items-center gap-2">
                    <NationFlag nationId={player.nation_id} className="w-5 h-5"/>
                    <h1 className="text-2xl font-display font-black text-text-emphasis">{player.name.first} {player.name.last}</h1>
                </div>
                {player.name.alias && <p className="text-md text-accent-secondary -mt-1">"{player.name.alias}"</p>}
                 <p className="text-sm font-bold text-accent mt-1">{player.playstyle}</p>
                <p className="text-sm text-text-secondary mt-1">{player.age} y/o | {player.position} | {player.preferred_foot} Foot | {player.squad_status}</p>
                <p className="text-sm text-text-secondary">Value: ${player.value.toLocaleString()}</p>
                 <button onClick={() => setIsModalOpen(true)} className="mt-2 text-xs text-accent hover:underline">
                    Generate Nickname
                </button>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="font-display font-black text-5xl text-text-emphasis">{player.current_ability}</p>
                <p className="text-xs text-text-secondary">Potential: {player.potential_ability}</p>
            </div>
        </div>
        
        {/* Attributes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                <AttributeGroup title="Physical" attributes={physicalAttrs} />
                <AttributeGroup title="Technical" attributes={technicalAttrs} />
                <AttributeGroup title="Mental" attributes={mentalAttrs} />
                <AttributeGroup title="Magical" attributes={magicalAttrs} />
            </div>
            <div className="flex flex-col items-center justify-center glass-surface p-2 rounded-md">
                <h3 className="text-md font-bold text-accent mb-1 uppercase tracking-wider">Attribute Hex</h3>
                <RadarChart data={radarData} size={280}/>
            </div>
        </div>

      {isModalOpen && (
        <NicknameModal player={player} onUpdatePlayer={onUpdatePlayer} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default PlayerProfile;