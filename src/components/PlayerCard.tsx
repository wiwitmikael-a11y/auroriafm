import React from 'react';
import { Player } from '../types';
import PlayerPortrait from './PlayerPortrait';
import NationFlag from './NationFlag';

interface PlayerCardProps {
  player: Player;
  onSelectPlayer: (id: string) => void;
  isSelected: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onSelectPlayer, isSelected }) => {
  const rarityColor =
    player.rarity === 'Legend' ? 'border-amber-400' :
    player.rarity === 'Epic' ? 'border-purple-400' :
    player.rarity === 'Rare' ? 'border-blue-400' :
    'border-gray-500';

  return (
    <div
      onClick={() => onSelectPlayer(player.id)}
      className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 border glass-surface ${
        isSelected ? 'border-accent shadow-[0_0_15px_var(--color-accent)]' : 'border-transparent hover:border-accent/50'
      }`}
    >
      <PlayerPortrait player={player} className="w-12 h-14 mr-4 flex-shrink-0" />
      <div className="flex-grow overflow-hidden">
        <div className="flex items-center gap-2">
           <NationFlag nationId={player.nation_id} />
           <p className="font-bold text-md truncate text-text-emphasis">{player.name.first} {player.name.last}</p>
        </div>
        <p className="text-xs text-text-secondary">{player.age} y/o | {player.position} | {player.squad_status}</p>
      </div>
      <div className={`flex-shrink-0 ml-4 text-center border-l-2 pl-4 ${rarityColor}`}>
        <p className="font-display font-black text-3xl text-text-emphasis">{player.current_ability}</p>
        <p className={`text-xs font-bold ${
            player.rarity === 'Legend' ? 'text-amber-400' : 
            player.rarity === 'Epic' ? 'text-purple-400' : 
            player.rarity === 'Rare' ? 'text-blue-400' : 
            'text-gray-400'
        }`}>{player.rarity}</p>
      </div>
    </div>
  );
};

export default PlayerCard;