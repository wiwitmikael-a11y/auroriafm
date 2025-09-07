import React from 'react';
import { Player, PlayerAttributes } from '../types';
import PlayerPortrait from './PlayerPortrait';
import NationFlag from './NationFlag';
import { useWorld } from '../contexts/WorldContext';

const getScoutedAttributeDisplay = (value: number, knowledge: number): string => {
  if (knowledge >= 100) return String(value);
  if (knowledge <= 0) return '??';
  const uncertainty = Math.max(2, 20 - Math.floor(knowledge / 5));
  const min = Math.max(10, value - Math.floor(uncertainty / 2));
  const max = Math.min(99, value + Math.ceil(uncertainty / 2));
  return `${min}-${max}`;
}

const AttributeGroup: React.FC<{ title: string; attributes: [string, number][], scoutingKnowledge: number }> = ({ title, attributes, scoutingKnowledge }) => (
    <div className="bg-slate-900/50 p-3 rounded-md">
        <h3 className="text-sm font-bold text-accent mb-2 uppercase tracking-wider">{title}</h3>
        <div className="flex flex-col space-y-1 text-xs">
            {attributes.map(([key, value]) => (
                <div key={key} className="flex justify-between">
                    <span className="uppercase text-text-secondary">{key.replace(/_/g, ' ')}</span>
                    <span className="font-bold text-text-emphasis">{getScoutedAttributeDisplay(value, scoutingKnowledge)}</span>
                </div>
            ))}
        </div>
    </div>
);

interface PlayerDetailModalProps {
  player: Player;
  onClose: () => void;
}

const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, onClose }) => {
    const { startScoutingPlayer, scoutingAssignments, findClubById } = useWorld();
    const club = findClubById(player.club_id);

    const physicalAttrs: [string, number][] = [['speed', player.attributes.speed], ['stamina', player.attributes.stamina], ['strength', player.attributes.strength]];
    const technicalAttrs: [string, number][] = [['shooting', player.attributes.shooting], ['dribbling', player.attributes.dribbling], ['passing', player.attributes.passing], ['tackling', player.attributes.tackling]];
    const mentalAttrs: [string, number][] = [['composure', player.attributes.composure], ['vision', player.attributes.vision]];
    const magicalAttrs: [string, number][] = [['arcane_dribble', player.attributes.arcane_dribble], ['elemental_shot', player.attributes.elemental_shot]];
    
    const isScouting = scoutingAssignments.some(a => a.playerId === player.id);
    const isScouted = player.scouting_knowledge === 100;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="glass-surface modal-content p-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-start gap-4 mb-4 pb-4 border-b border-border flex-shrink-0">
                    <PlayerPortrait player={player} className="w-20 h-24 flex-shrink-0" />
                    <div className="flex-grow">
                        <div className="flex items-center gap-2">
                            <NationFlag nationId={player.nation_id} className="w-5 h-5"/>
                            <h1 className="text-2xl font-display font-black text-text-emphasis">{player.name.first} {player.name.last}</h1>
                        </div>
                        <p className="text-sm font-bold text-accent mt-1">{player.playstyle}</p>
                        <p className="text-sm text-text-secondary mt-1">{player.age} y/o | {player.position} | {club?.name}</p>
                        <p className="text-sm text-text-secondary">Value: ${player.value.toLocaleString()}</p>
                        <p className="text-sm text-text-secondary mt-1 font-bold">Scouting Knowledge: {player.scouting_knowledge}%</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="font-display font-black text-5xl text-text-emphasis">{getScoutedAttributeDisplay(player.current_ability, player.scouting_knowledge)}</p>
                        <p className="text-xs text-text-secondary">Potential: {getScoutedAttributeDisplay(player.potential_ability, player.scouting_knowledge)}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto pr-2">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <AttributeGroup title="Physical" attributes={physicalAttrs} scoutingKnowledge={player.scouting_knowledge} />
                        <AttributeGroup title="Technical" attributes={technicalAttrs} scoutingKnowledge={player.scouting_knowledge} />
                        <AttributeGroup title="Mental" attributes={mentalAttrs} scoutingKnowledge={player.scouting_knowledge} />
                        <AttributeGroup title="Magical" attributes={magicalAttrs} scoutingKnowledge={player.scouting_knowledge} />
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="mt-4 pt-4 border-t border-border flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="button-secondary">Close</button>
                    <button 
                        className="button-secondary" 
                        style={{borderColor: 'var(--color-accent-secondary)', color: 'var(--color-accent-secondary)'}}
                        onClick={() => startScoutingPlayer(player.id)}
                        disabled={isScouting || isScouted}
                    >
                        {isScouted ? 'Fully Scouted' : isScouting ? 'Scouting...' : 'Scout Player'}
                    </button>
                    <button className="button-primary">Make Offer</button>
                </div>
            </div>
        </div>
    );
};

export default PlayerDetailModal;