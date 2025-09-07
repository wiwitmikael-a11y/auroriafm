import React from 'react';
import { Player } from '../types';
import PlayerPortrait from './PlayerPortrait';
import NationFlag from './NationFlag';
import StarRating from './StarRating';

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
        isSelected ? 'selected-player-card-glow' : 'border-transparent hover:border-accent/50'
      }`}
    >
      <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center mr-3">
        <PlayerPortrait player={player} className="w-full h-full object-contain" />
      </div>
      <div className="flex-grow overflow-hidden">
        <div className="flex items-center gap-2">
           <NationFlag nationId={player.nation_id} />
           <p className={`font-bold text-md truncate text-text-emphasis ${isSelected ? 'selected-player-glow' : ''}`}>{player.name.first} {player.name.last}</p>
        </div>
        <p className="text-xs text-text-secondary">{player.age} y/o | {player.position} | {player.squad_status}</p>
      </div>
      <div className={`flex-shrink-0 ml-4 pl-4`}>
         <StarRating currentAbility={player.current_ability} potentialAbility={player.potential_ability} />
         <p className={`text-xs font-bold text-center mt-1 ${
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