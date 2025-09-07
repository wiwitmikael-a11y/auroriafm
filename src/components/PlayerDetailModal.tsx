import React from 'react';
import { Player, PlayerAttributes } from '../types';
import PlayerPortrait from './PlayerPortrait';
import NationFlag from './NationFlag';

// Re-usable AttributeGroup component, simplified for this modal
const AttributeGroup: React.FC<{ title: string; attributes: Partial<PlayerAttributes> }> = ({ title, attributes }) => (
    <div className="bg-slate-900/50 p-3 rounded-md">
        <h3 className="text-sm font-bold text-accent mb-2 uppercase tracking-wider">{title}</h3>
        <div className="flex flex-col space-y-1 text-xs">
            {Object.entries(attributes).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                    <span className="uppercase text-text-secondary">{key.replace(/_/g, ' ')}</span>
                    <span className="font-bold text-text-emphasis">{value}</span>
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
    
    const physicalAttrs = { speed: player.attributes.speed, stamina: player.attributes.stamina, strength: player.attributes.strength };
    const technicalAttrs = { shooting: player.attributes.shooting, dribbling: player.attributes.dribbling, passing: player.attributes.passing, tackling: player.attributes.tackling };
    const mentalAttrs = { composure: player.attributes.composure, vision: player.attributes.vision };
    const magicalAttrs = { arcane_dribble: player.attributes.arcane_dribble, elemental_shot: player.attributes.elemental_shot };

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
                        <p className="text-sm text-text-secondary mt-1">{player.age} y/o | {player.position} | {player.preferred_foot} Foot</p>
                        <p className="text-sm text-text-secondary">Value: ${player.value.toLocaleString()}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="font-display font-black text-5xl text-text-emphasis">{player.current_ability}</p>
                        <p className="text-xs text-text-secondary">Potential: {player.potential_ability}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto pr-2">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <AttributeGroup title="Physical" attributes={physicalAttrs} />
                        <AttributeGroup title="Technical" attributes={technicalAttrs} />
                        <AttributeGroup title="Mental" attributes={mentalAttrs} />
                        <AttributeGroup title="Magical" attributes={magicalAttrs} />
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="mt-4 pt-4 border-t border-border flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="button-secondary">Close</button>
                    <button className="button-secondary" style={{borderColor: 'var(--color-accent-secondary)', color: 'var(--color-accent-secondary)'}}>Scout Player</button>
                    <button className="button-primary">Make Offer</button>
                </div>
            </div>
        </div>
    );
};

export default PlayerDetailModal;